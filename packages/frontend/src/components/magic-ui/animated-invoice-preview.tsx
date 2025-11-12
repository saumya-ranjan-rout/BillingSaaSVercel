'use client';
import { motion } from 'framer-motion';
import { useRef } from 'react';

// ✅ Define prop and data structure
interface InvoiceItem {
  id: string | number;
  description: string;
  amount: number;
}

interface Invoice {
  number: string | number;
  items: InvoiceItem[];
  total: number;
}

interface AnimatedInvoicePreviewProps {
  invoice: Invoice;
}

export function AnimatedInvoicePreview({ invoice }: AnimatedInvoicePreviewProps) {
  const constraintsRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      ref={constraintsRef}
      className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-2xl"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Invoice #{invoice.number}
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {invoice.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between py-2 border-b"
            >
              <span>{item.description}</span>
              <span>₹{item.amount}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t-2 border-dashed"
        >
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <motion.span
              key={invoice.total}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-purple-600"
            >
              ₹{invoice.total}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
