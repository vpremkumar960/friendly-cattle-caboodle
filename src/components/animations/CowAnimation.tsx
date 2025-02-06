
import { motion } from "framer-motion";

const CowAnimation = () => {
  return (
    <div className="relative h-40 overflow-hidden">
      {/* Parent Cow */}
      <motion.div
        className="absolute right-0 bottom-0"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
      >
        <div className="relative">
          <div className="w-24 h-16 bg-gray-200 rounded-3xl transform -skew-x-6">
            {/* Body */}
            <div className="absolute -top-8 -left-2 w-12 h-12 bg-gray-200 rounded-full">
              {/* Head */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full" /> {/* Eye */}
            </div>
            <div className="absolute -bottom-4 left-2 w-3 h-8 bg-gray-200 rounded-full" /> {/* Leg 1 */}
            <div className="absolute -bottom-4 left-8 w-3 h-8 bg-gray-200 rounded-full" /> {/* Leg 2 */}
            <div className="absolute -bottom-4 right-8 w-3 h-8 bg-gray-200 rounded-full" /> {/* Leg 3 */}
            <div className="absolute -bottom-4 right-2 w-3 h-8 bg-gray-200 rounded-full" /> {/* Leg 4 */}
          </div>
        </div>
      </motion.div>

      {/* Baby Calf */}
      <motion.div
        className="absolute right-28 bottom-0"
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
      >
        <div className="relative">
          <div className="w-16 h-12 bg-gray-300 rounded-3xl transform -skew-x-6 scale-75">
            {/* Body */}
            <div className="absolute -top-6 -left-2 w-8 h-8 bg-gray-300 rounded-full">
              {/* Head */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-black rounded-full" /> {/* Eye */}
            </div>
            <div className="absolute -bottom-3 left-1.5 w-2 h-6 bg-gray-300 rounded-full" /> {/* Leg 1 */}
            <div className="absolute -bottom-3 left-6 w-2 h-6 bg-gray-300 rounded-full" /> {/* Leg 2 */}
            <div className="absolute -bottom-3 right-6 w-2 h-6 bg-gray-300 rounded-full" /> {/* Leg 3 */}
            <div className="absolute -bottom-3 right-1.5 w-2 h-6 bg-gray-300 rounded-full" /> {/* Leg 4 */}
          </div>
        </div>
      </motion.div>

      {/* Grass Animation */}
      <motion.div 
        className="absolute bottom-0 w-full h-6 bg-green-100"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute bottom-0 w-full flex justify-around">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-4 bg-green-400 rounded-t-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.02,
                type: "spring",
                stiffness: 100
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CowAnimation;
