export interface Message {
    id: string;
    conversationId: string;
    sender: 'client' | 'agent';
    date: string;
    text: string;
}