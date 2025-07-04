export interface Message {
    id: string;
    conversationId: string | null;
    sender: 'client' | 'agent';
    date: string;
    text: string;
    task: string | null;
    oportunity: string | null;
}