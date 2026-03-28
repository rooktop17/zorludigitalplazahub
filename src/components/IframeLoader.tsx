import { motion } from "framer-motion";

const IframeLoader = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background gap-4">
      <motion.div
        className="w-10 h-10 rounded-xl border-2 border-primary/30 border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="space-y-2 w-48">
        <div className="h-2 rounded-full shimmer-loader" />
        <div className="h-2 rounded-full shimmer-loader w-3/4 mx-auto" />
      </div>
      <p className="text-xs text-muted-foreground">Modül yükleniyor...</p>
    </div>
  );
};

export default IframeLoader;
