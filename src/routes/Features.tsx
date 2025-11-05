import { useEffect } from "react";
import { motion } from "framer-motion";
import { useApplicationStore } from "@/store/ApplicationStore";
import {
  Sparkles,
  CheckCircle,
  Laptop,
  Smartphone,
  Globe,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
} from "@heroui/react";

export default function Features() {
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
  const checkForUpdates = useApplicationStore((state) => state.checkForUpdates);
  const fetchAppInfo = useApplicationStore((state) => state.fetchAppInfo);

  useEffect(() => {
    fetchAppInfo();
    if (!updateMetadata) {
      checkForUpdates();
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
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

  const getPlatformIcon = (platformName: string) => {
    switch (platformName.toLowerCase()) {
      case "windows":
      case "linux":
      case "macos":
        return <Laptop size={18} className="text-blue-500" />;
      case "android":
      case "ios":
        return <Smartphone size={18} className="text-green-500" />;
      case "web":
        return <Globe size={18} className="text-purple-500" />;
      default:
        return <Laptop size={18} className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-4" variants={itemVariants}>
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Features
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Discover what's new in BIM
          </p>
        </div>
      </motion.div>

      {!updateMetadata ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Loading features...
          </p>
        </motion.div>
      ) : (
        updateMetadata.featureSet.features
          .slice()
          .reverse()
          .map((featureVersion) => (
            <motion.div key={featureVersion.id} variants={itemVariants}>
              <Card
                className={
                  featureVersion.isLatest
                    ? "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-300 dark:border-green-700 shadow-lg"
                    : "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-md"
                }
              >
                <CardHeader className="flex gap-3 pb-2">
                  <div
                    className={`p-2 rounded-xl shadow-md ${
                      featureVersion.isLatest
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gradient-to-br from-blue-500 to-cyan-600"
                    }`}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3">
                      <p
                        className={`text-lg font-bold ${
                          featureVersion.isLatest
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400"
                        } bg-clip-text text-transparent`}
                      >
                        Version {featureVersion.id.replace("f-", "")}
                      </p>
                      {featureVersion.isLatest && (
                        <Chip
                          color="success"
                          variant="shadow"
                          size="sm"
                          className="font-semibold"
                        >
                          Latest
                        </Chip>
                      )}
                      {featureVersion.isFirst && (
                        <Chip
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="font-semibold"
                        >
                          Initial Release
                        </Chip>
                      )}
                    </div>
                    <p className="text-small text-default-500">
                      {featureVersion.items.length} features added
                    </p>
                  </div>
                </CardHeader>
                <Divider
                  className={
                    featureVersion.isLatest
                      ? "bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800"
                      : "bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 dark:from-blue-800 dark:via-cyan-800 dark:to-blue-800"
                  }
                />
                <CardBody className="gap-4 pt-6 pb-6">
                  <div className="space-y-3">
                    {featureVersion.items.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          featureVersion.isLatest
                            ? "bg-white/60 dark:bg-gray-800/60 border-green-100 dark:border-green-900/50"
                            : "bg-white/50 dark:bg-gray-800/50 border-blue-100 dark:border-blue-900/50"
                        } backdrop-blur-sm shadow-sm`}
                      >
                        <CheckCircle
                          size={20}
                          className={
                            featureVersion.isLatest
                              ? "text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                              : "text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                          }
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  {featureVersion.supportedPlatforms.length > 0 && (
                    <>
                      <Divider className="my-2" />
                      <div>
                        <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Supported Platforms:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {featureVersion.supportedPlatforms.map((platform) => (
                            <Chip
                              key={platform.id}
                              variant="flat"
                              className="font-medium"
                              startContent={getPlatformIcon(platform.name)}
                            >
                              {platform.name} {platform.version}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {featureVersion.platformChanges.length > 0 && (
                    <div className={`p-3 rounded-lg ${
                      featureVersion.isLatest
                        ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                        : "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                    }`}>
                      <p className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Platform Changes:
                      </p>
                      {featureVersion.platformChanges.map((change, index) => (
                        <p
                          key={index}
                          className="text-xs text-gray-600 dark:text-gray-400"
                        >
                          • {change}
                        </p>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ))
      )}
    </motion.div>
  );
}
