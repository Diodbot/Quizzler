import { motion } from 'framer-motion';

const AuthCard = ({ title, children, footer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md text-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      {children}
      {footer && <div className="mt-4 text-center text-sm text-gray-400">{footer}</div>}
    </motion.div>
  );
};

export default AuthCard;
