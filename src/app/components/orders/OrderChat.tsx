//src/app/components/orders/OrderChat.tsx
'use client';

import { useState, useTransition } from 'react';
import { addOrderMessage } from '@/actions/order-messages-actions';

interface Message {
  id: string;
  sender: 'ADMIN' | 'USER' | 'MANAGER' | string;
  message: string;
  createdAt: Date;
}

interface OrderChatProps {
  orderId: string;
  userId: string;
  initialMessages: Message[];
}

export default function OrderChat({ orderId, userId, initialMessages }: OrderChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setErrorMsg(null);
    const currentText = text;
    setText(''); // Limpiamos el input de inmediato para mejor UX

    startTransition(async () => {
      const result = await addOrderMessage(orderId, userId, currentText, 'USER');
      
      if (!result.ok) {
        setErrorMsg(result.error || "No se pudo enviar el mensaje.");
        setText(currentText); // Restauramos si hubo error
        return;
      }

      if (result.newMessage) {
        setMessages((prev) => [...prev, result.newMessage as Message]);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 shadow-sm flex flex-col h-112.5">
      <div className="border-b border-stone-100 pb-3 mb-4">
        <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-wider">
          💬 Canal de Comunicación del Pedido
        </h3>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Consultá dudas sobre la fabricación o el envío directamente con el taller.
        </p>
      </div>

      {/* Contenedor de Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
              No hay mensajes aún en esta orden.<br/>¡Escríbenos si tienes alguna duda!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.sender === 'ADMIN';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
              >
                <span className="text-[10px] font-bold text-stone-400 mb-1 px-1 uppercase tracking-wider">
                  {isAdmin ? 'Taller DecorArte (Admin)' : 'Tú'}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs font-medium leading-relaxed ${
                    isAdmin
                      ? 'bg-[#F5F2EB] text-[#1C1816] border border-stone-200 rounded-tl-sm'
                      : 'bg-[#1C1816] text-[#FFC107] rounded-tr-sm shadow-sm'
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[9px] text-stone-300 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {errorMsg && (
        <div className="mb-2 bg-red-50 text-red-700 text-xs p-2 rounded-xl border border-red-200 font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Formulario de Envío */}
      <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-stone-100">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje sobre tu pedido..."
          disabled={isPending}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all disabled:opacity-50"
        >
          {isPending ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}