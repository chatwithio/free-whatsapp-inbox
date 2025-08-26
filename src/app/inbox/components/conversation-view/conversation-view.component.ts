import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  AfterViewChecked,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { WhatsappFormatPipe } from '../../../shared/pipes/whatsapp-format.pipe';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [CommonModule, FormsModule, WhatsappFormatPipe],
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss']
})
export class ConversationViewComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() conversationId: string | null = null;

  @ViewChild('bottom') private bottom!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  messages: Message[] = [];
  newMessageText: string = '';
  isSending: boolean = false;

  // Paginación / estados
  private pageSize = 20;
  private loadedCount = 0;             // nº total de mensajes cargados (para pedir más antiguos)
  private loadingOlder = false;
  private allOlderLoaded = false;

  // Scroll / autoscroll
  private shouldScrollToBottom = false; // bajar al fondo tras render
  private userIsAtBottom = true;        // actualizado en cada scroll
  private nearBottomThreshold = 16;     // margen en px para considerar "abajo"

  // Polling
  private pollMs = 5000;
  private pollSub?: Subscription;

  constructor(private messageService: MessageService, private cdRef: ChangeDetectorRef, private zone: NgZone) { }

  // ========= CICLO DE VIDA =========

  ngOnInit(): void {
    if (this.conversationId) {
      this.initialLoad();
    }
    // Poll con RxJS
    this.pollSub = interval(this.pollMs).subscribe(() => this.pollNewMessages());
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId']) {
      this.resetState();
      if (this.conversationId) {
        this.initialLoad();
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // ========= CARGAS =========

  /** Carga inicial: últimos pageSize y baja al fondo */
  private initialLoad(): void {
    this.messageService.getMessages(this.conversationId!, this.pageSize, 0).subscribe({
      next: (data) => {
        const latest = this.ensureAscending(data);
        this.messages = latest;
        this.loadedCount = latest.length;
        this.allOlderLoaded = latest.length < this.pageSize;
        this.shouldScrollToBottom = true;
      },
      error: (err) => console.error('Error carga inicial:', err)
    });
  }

  /** Poll de nuevos (más recientes). Fusiona y baja solo si el usuario está abajo. */
  private pollNewMessages(): void {
    if (!this.conversationId) return;

    this.messageService.getMessages(this.conversationId, this.pageSize, 0).subscribe({
      next: (page) => {
        const latest = this.ensureAscending(page);

        // Primera carga en caso de que no haya mensajes aún (poco probable aquí)
        if (!this.messages.length) {
          this.messages = latest;
          this.loadedCount = latest.length;
          this.allOlderLoaded = latest.length < this.pageSize;
          this.maybeScrollToBottomOnNew();
          return;
        }

        // Añade solo los realmente nuevos por id
        const knownIds = new Set(this.messages.map(m => m.id));
        const onlyNew = latest.filter(m => !knownIds.has(m.id));
        if (onlyNew.length) {
          this.messages = this.mergeAppend(this.messages, onlyNew);
          this.loadedCount = this.messages.length;
          this.maybeScrollToBottomOnNew();
        }
      },
      error: (err) => console.error('Error en polling:', err)
    });
  }

  /** Carga más antiguos al llegar arriba. Prepend y conserva posición del scroll. */
  private loadOlder(): void {
    if (this.loadingOlder || this.allOlderLoaded || !this.conversationId) return;
    this.loadingOlder = true;

    const sc = this.scrollContainer?.nativeElement;
    if (!sc) { this.loadingOlder = false; return; }

    // Medidas ANTES de insertar
    const prevScrollHeight = sc.scrollHeight;
    const prevScrollTop = sc.scrollTop;

    this.messageService.getMessages(this.conversationId, this.pageSize, this.loadedCount).subscribe({
      next: (olderPage) => {
        const older = this.ensureAscending(olderPage);

        if (!older.length) {
          this.allOlderLoaded = true;
          this.loadingOlder = false;
          return;
        }

        // Prepend sin duplicar
        const byId = this.byId;
        const dedup = older.filter(m => !byId.has(m.id));
        if (dedup.length) {
          this.messages = [...dedup, ...this.messages];
          this.loadedCount = this.messages.length;
        } else {
          this.allOlderLoaded = older.length < this.pageSize;
        }

        // Forzamos render y AJUSTAMOS tras pintar usando la diferencia de alturas
        this.cdRef.detectChanges();
        this.zone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            const newScrollHeight = sc.scrollHeight;
            const delta = newScrollHeight - prevScrollHeight;
            sc.scrollTop = prevScrollTop + delta; // mantiene en pantalla el último mensaje visible
            this.loadingOlder = false;
          });
        });
      },
      error: (err) => {
        console.error('Error cargando antiguos:', err);
        this.loadingOlder = false;
      }
    });
  }


  // ========= ENVÍO (sin carga optimista) =========

  /** Envía y espera al servidor. Si el endpoint devuelve el mensaje, lo añadimos; si no, lo captará el polling. */
  sendMessage(): void {
    const messageText = this.newMessageText.trim();
    if (!messageText || this.isSending || !this.conversationId) return;

    this.isSending = true;

    this.messageService.sendMessage(this.conversationId, messageText).subscribe({
      next: (serverMsg: Message | void) => {
        this.isSending = false;
        this.newMessageText = '';

        if (serverMsg) {
          // Si el backend devuelve el mensaje creado, lo añadimos aquí
          const knownIds = new Set(this.messages.map(m => m.id));
          if (!knownIds.has(serverMsg.id)) {
            this.messages = this.mergeAppend(this.messages, [serverMsg]);
            this.loadedCount = this.messages.length;
            // Tras enviar, baja al fondo
            this.shouldScrollToBottom = true;
          }
        }
        // Si no devuelve nada, el polling lo traerá en breve.
      },
      error: () => {
        this.isSending = false;
      }
    });
  }

  // ========= SCROLL / EVENTOS =========

  handleScroll(event: Event): void {
    const target = event.target as HTMLElement;

    // estado de "abajo"
    this.userIsAtBottom = (target.scrollHeight - (target.scrollTop + target.clientHeight)) <= this.nearBottomThreshold;

    // cargar más antiguos si llega arriba
    if (target.scrollTop === 0) {
      this.loadOlder();
    }
  }

  private scrollToBottom(): void {
    if (!this.bottom) return;
    // 'instant' para no interferir con la conservación al prepender
    this.bottom.nativeElement.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    this.userIsAtBottom = true;
  }

  /** Si estamos abajo, al llegar nuevos, baja; si no, respeta la posición */
  private maybeScrollToBottomOnNew(): void {
    if (this.userIsAtBottom) {
      this.shouldScrollToBottom = true;
    }
  }

  // ========= HELPERS =========

  /** Mapa de ids para deduplicar rápido */
  private get byId(): Map<string, Message> {
    const map = new Map<string, Message>();
    for (const m of this.messages) map.set(m.id, m);
    return map;
  }

  /** Garantiza orden ASC (antiguo -> nuevo). Si tu API ya es ASC, podrías devolver arr sin tocar. */
  private ensureAscending(arr: Message[]): Message[] {
    return [...arr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /** Añade elementos nuevos, deduplica por id y mantiene orden ascendente */
  private mergeAppend(curr: Message[], toAppend: Message[]): Message[] {
    const map = new Map<string, Message>(curr.map(m => [m.id, m]));
    for (const n of toAppend) {
      map.set(n.id, n);
    }
    const merged = Array.from(map.values());
    return this.ensureAscending(merged);
  }

  /** Reinicia estado al cambiar de conversación */
  private resetState(): void {
    this.messages = [];
    this.newMessageText = '';
    this.isSending = false;

    this.pageSize = 20;
    this.loadedCount = 0;
    this.loadingOlder = false;
    this.allOlderLoaded = false;

    this.shouldScrollToBottom = false;
    this.userIsAtBottom = true;
  }
}
