import { Card, CardBody, CardHeader, Divider, Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Settings as SettingsIcon,
} from "lucide-react";
import useMenuBarStore from "@/store/MenuBarStore";
import clsx from "clsx";

export default function Settings() {
  const position = useMenuBarStore((state) => state.position);
  const setPosition = useMenuBarStore((state) => state.setPosition);

  const positions: Array<{
    value: "left" | "right" | "top" | "bottom";
    label: string;
    icon: typeof PanelLeft;
  }> = [
    { value: "left", label: "Left", icon: PanelLeft },
    { value: "right", label: "Right", icon: PanelRight },
    { value: "top", label: "Top", icon: PanelTop },
    { value: "bottom", label: "Bottom", icon: PanelBottom },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div 
      className="p-6 space-y-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-4" variants={itemVariants}>
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Settings
        </h1>
      </motion.div>

      <motion.div variants={itemVariants}>
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader className="flex gap-3 pb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
            <PanelLeft className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Sidebar Position
            </p>
            <p className="text-small text-default-500">
              Choose where the sidebar appears
            </p>
          </div>
        </CardHeader>
        <Divider className="bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800" />
        <CardBody className="gap-6 pt-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {positions.map(({ value, label, icon: Icon }) => (
              <Button
                as={motion.button}
                key={value}
                onPress={() => setPosition(value)}
                variant={position === value ? "shadow" : "bordered"}
                color={position === value ? "secondary" : "default"}
                className={clsx("h-28 flex-col gap-3 font-semibold", {
                  "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none": position === value,
                  "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800": position !== value,
                })}
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: position === value 
                    ? "0 20px 25px -5px rgba(168, 85, 247, 0.5)" 
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  transition: { type: "spring", stiffness: 400, damping: 10 } 
                }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <Icon size={32} />
                <span className="text-base">{label}</span>
                {position === value && (
                  <motion.div 
                    className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </Button>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">Current position: </span>
              <span className="font-bold capitalize bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {position}
              </span>
            </p>
          </div>
        </CardBody>
      </Card>
      </motion.div>
    </motion.div>
  );
}
