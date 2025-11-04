import { Card, CardBody, CardHeader, Divider, Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
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
        type: "spring",
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
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <h1 className="text-3xl font-bold">Settings</h1>
      </motion.div>

      <motion.div variants={itemVariants}>
      <Card className="bg-zinc-50 dark:bg-zinc-800">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sidebar Position</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {positions.map(({ value, label, icon: Icon }) => (
              <Button
                as={motion.button}
                key={value}
                onPress={() => setPosition(value)}
                variant={position === value ? "solid" : "bordered"}
                color={position === value ? "primary" : "default"}
                className={clsx("h-24 flex-col gap-2", {
                  "border-2 border-blue-500": position === value,
                })}
                whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <Icon size={28} />
                <span className="font-semibold">{label}</span>
              </Button>
            ))}
          </div>
          <p className="text-sm text-zinc-500 mt-4">
            Current position:{" "}
            <span className="font-semibold capitalize">{position}</span>
          </p>
        </CardBody>
      </Card>
      </motion.div>
    </motion.div>
  );
}
