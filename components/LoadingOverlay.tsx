"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
    show: boolean;
    text?: string;
};

export default function LoadingOverlay({
    show,
    text = "Carregando...",
}: Props) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4"
                    >
                        {/* Spinner animado */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                            }}
                            className="h-10 w-10 rounded-full border-4 border-green-600 border-t-transparent"
                        />

                        <p className="text-sm text-gray-500">{text}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}