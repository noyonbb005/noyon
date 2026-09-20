import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  CheckCheck,
  Send,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const MessageView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<number, Array<{ sender: 'user' | 'seller'; text: string; time: string }>>>({
    1: [
      { sender: 'seller', text: 'Hello! Thank you for ordering from OrangeTech store. Your items will be dispatched today.', time: '10:30 AM' },
      { sender: 'user', text: 'Great! Will I get a tracking code?', time: '10:32 AM' },
      { sender: 'seller', text: 'Yes, absolutely! As soon as the courier scans the package you will receive an SMS and app alert.', time: '10:33 AM' },
    ],
    2: [
      { sender: 'seller', text: 'Hi Alex! The Summer Linen Shirt you viewed is currently on a 50% flash discount until midnight.', time: 'Yesterday' },
    ],
    3: [
      { sender: 'seller', text: 'OrangeShop Customer Support: We are here 24/7. Let us know if you need assistance with your payments or refunds.', time: '2 days ago' },
    ],
  });

  const chatList = [
    {
      id: 1,
      name: 'OrangeTech Official Store',
      avatar: '🎧',
      lastMessage: 'As soon as the courier scans the package you will receive...',
      time: '10:33 AM',
      unread: 1,
      badge: 'Official Store',
    },
    {
      id: 2,
      name: 'UrbanStyle Apparel',
      avatar: '👕',
      lastMessage: 'The Summer Linen Shirt you viewed is currently on...',
      time: 'Yesterday',
      unread: 1,
      badge: 'Top Seller',
    },
    {
      id: 3,
      name: 'OrangeShop 24/7 Support',
      avatar: '🛡️',
      lastMessage: 'OrangeShop Customer Support: We are here 24/7...',
      time: '2 days ago',
      unread: 0,
      badge: 'Help Center',
    },
  ];

  const notifications = [
    {
      id: 101,
      title: '🎉 50% Off Voucher Claimed!',
      description: 'Use voucher code ORANGE50 for extra savings on all electronic gadgets.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 102,
      title: '📦 Order Dispatched',
      description: 'Your package #ORD-984321 is on the way with Express Delivery.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 103,
      title: '⚡ Mega Flash Sale is Live',
      description: 'Over 2,000 top items at discounted prices for the next 3 hours.',
      time: '2 days ago',
      unread: false,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || selectedChat === null) return;

    const newMsg = {
      sender: 'user' as const,
      text: messageText,
      time: 'Just now',
    };

    setChatHistory((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));

    setMessageText('');

    // Simulate auto-reply
    setTimeout(() => {
      const autoReplies = [
        'Thanks for reaching out! A customer agent will respond shortly.',
        'Got it! We have noted your request.',
        'Thank you! Have a wonderful shopping experience with OrangeShop.',
      ];
      const reply = {
        sender: 'seller' as const,
        text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        time: 'Just now',
      };
      setChatHistory((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), reply],
      }));
    }, 1000);
  };

  const activeChatInfo = chatList.find((c) => c.id === selectedChat);

  return (
    <div className="pb-20 bg-stone-50 min-h-screen">
      {/* Top Header */}
      <div className="bg-white p-4 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-stone-900">Inbox & Messages</h2>
          <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('chats');
                setSelectedChat(null);
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'chats'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Chats (2)
            </button>
            <button
              onClick={() => {
                setActiveTab('notifications');
                setSelectedChat(null);
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Alerts
            </button>
          </div>
        </div>
      </div>

      {/* If Chat Conversation is Open */}
      {selectedChat !== null && activeChatInfo ? (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-stone-100">
          {/* Conversation header */}
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-xs font-bold text-orange-600 hover:underline mr-1"
              >
                &larr; Back
              </button>
              <span className="text-xl">{activeChatInfo.avatar}</span>
              <div>
                <h4 className="text-xs font-bold text-stone-900 leading-tight">
                  {activeChatInfo.name}
                </h4>
                <span className="text-[10px] text-emerald-600 font-medium">● Online now</span>
              </div>
            </div>
          </div>

          {/* Conversation message list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(chatHistory[selectedChat] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-stone-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Chat input box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-stone-100 border border-transparent focus:border-orange-500 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : activeTab === 'chats' ? (
        /* Chat list */
        <div className="divide-y divide-stone-200 bg-white">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className="p-3.5 flex items-center gap-3 hover:bg-orange-50/50 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                    {chat.name}
                  </h4>
                  <span className="text-[10px] text-stone-400 shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                    {chat.badge}
                  </span>
                </div>
              </div>
              {chat.unread > 0 && (
                <span className="w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Notifications tab */
        <div className="p-3 space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-xl border transition-colors bg-white ${
                notif.unread
                  ? 'border-orange-300 ring-1 ring-orange-200 shadow-xs'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-stone-900">{notif.title}</h4>
                <span className="text-[10px] text-stone-400 shrink-0">{notif.time}</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">{notif.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
