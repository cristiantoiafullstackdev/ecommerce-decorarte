// src/app/components/orders/OrderChat.tsx
'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addOrderMessage, markMessagesAsRead, OrderMessageItem } from '@/actions/order-messages-actions';
import { Role } from '@prisma/client';

interface OrderChatProps {
  orderId: string;
  userId: string;
  initialMessages: OrderMessageItem[];
  currentUserRole?: Role; 
}

export default function OrderChat({ 
  orderId, 
  userId, 
  initialMessages, 
  currentUserRole = 'USER' 
}: OrderChatProps) {
  const [messages, setMessages] = useState<OrderMessageItem[]>(initialMessages);
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const isAdminView = currentUserRole === 'ADMIN';
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 1. Al montar el componente, marcamos los mensajes como leídos en la base de datos
  useEffect(() => {
    markMessagesAsRead(orderId, currentUserRole).then((res) => {
      if (res.ok) {
        router.refresh(); // Refresca los contadores globales al leer
      }
    });
  }, [orderId, currentUserRole, router]);

  // 2. Scroll posicional inicial al cargar el componente
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setErrorMsg(null);
    const currentText = text;
    setText(''); 

    startTransition(async () => {
      const result = await addOrderMessage(orderId, userId, currentText, currentUserRole);
      
      if (!result.ok) {
        setErrorMsg(result.error || "No se pudo enviar el mensaje.");
        setText(currentText); 
        return;
      }

      if (result.newMessage) {
        // Actualización local inmediata y scroll posicional forzado al fondo solo porque el usuario escribió
        setMessages((prev) => [...prev, result.newMessage]);
        
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        router.refresh();
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 shadow-sm flex flex-col h-[450px]">
      <div className="border-b border-stone-100 pb-3 mb-4 shrink-0">
        <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-wider">
          💬 Canal de Comunicación del Pedido
        </h3>
        <p className="text-[11px] text-stone-500 mt-0.5">
          {isAdminView 
            ? "Responde las consultas del cliente sobre esta orden." 
            : "Consultá dudas sobre la fabricación o el envío directamente con el taller."}
        </p>
      </div>

      {/* Contenedor con scroll posicional interno estricto (Sin sondeos automáticos intrusivos) */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
              No hay mensajes aún en esta orden.<br/>
              {isAdminView ? "Escribe el primer mensaje al cliente." : "¡Escríbenos si tienes alguna duda!"}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.sender === currentUserRole;
            
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-bold text-stone-400 mb-1 px-1 uppercase tracking-wider">
                  {msg.sender === 'ADMIN' ? 'Taller DecorArte (Admin)' : 'Cliente'}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs font-medium leading-relaxed ${
                    isMyMessage
                      ? 'bg-[#1C1816] text-[#FFC107] rounded-tr-sm shadow-sm' 
                      : 'bg-[#F5F2EB] text-[#1C1816] border border-stone-200 rounded-tl-sm' 
                  }`}
                >
                  {msg.content}
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
        <div className="mb-2 bg-red-50 text-red-700 text-xs p-2 rounded-xl border border-red-200 font-bold shrink-0">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Formulario de Envío */}
      <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-stone-100 shrink-0">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAdminView ? "Escribe una respuesta al cliente..." : "Escribe un mensaje sobre tu pedido..."}
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