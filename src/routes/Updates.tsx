import { useEffect } from "react";
import { motion } from "framer-motion";
import { useApplicationStore } from "@/store/ApplicationStore";
import { open } from "@tauri-apps/plugin-shell";
import {
  Bug,
  AlertCircle,
  CheckCircle2,
  Laptop,
  Smartphone,
  Globe,
  Package,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Button,
} from "@heroui/react";

export default function Updates() {
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
  const checkForUpdates = useApplicationStore((state) => state.checkForUpdates);
  const fetchAppInfo = useApplicationStore((state) => state.fetchAppInfo);
  const isCheckingUpdate = useApplicationStore(
    (state) => state.isCheckingUpdate
  );

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
        return <Laptop size={18} className="text-orange-500" />;
      case "android":
      case "ios":
        return <Smartphone size={18} className="text-rose-500" />;
      case "web":
        return <Globe size={18} className="text-purple-500" />;
      default:
        return <Laptop size={18} className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "danger";
      case "high":
        return "warning";
      case "medium":
        return "primary";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
            <Bug className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Updates & Bug Fixes
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track all improvements and resolved issues
            </p>
          </div>
        </div>
        <Button
          color="primary"
          variant="shadow"
          onPress={checkForUpdates}
          isLoading={isCheckingUpdate}
          startContent={!isCheckingUpdate && <RefreshCw size={18} />}
        >
          Check Updates
        </Button>
      </motion.div>

      {/* Severity Badge */}
      {updateMetadata && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <CardBody className="flex flex-row items-center gap-4">
              <AlertCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Severity Level
                </p>
              </div>
              <Chip
                color={getSeverityColor(updateMetadata.severity)}
                variant="shadow"
                size="lg"
                className="font-bold"
              >
                {updateMetadata.severity}
              </Chip>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Bug Fixes Section */}
      {!updateMetadata ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Loading updates...
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Bug Fixes & Error Resolutions
            </h2>
          </motion.div>

          {updateMetadata.errorSet.errors
            .slice()
            .reverse()
            .map((errorVersion) => (
              <motion.div key={errorVersion.id} variants={itemVariants}>
                <Card
                  className={
                    errorVersion.isLatest
                      ? "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-300 dark:border-green-700 shadow-lg"
                      : "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800 shadow-md"
                  }
                >
                  <CardHeader className="flex gap-3 pb-2">
                    <div
                      className={`p-2 rounded-xl shadow-md ${
                        errorVersion.isLatest
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : "bg-gradient-to-br from-orange-500 to-red-600"
                      }`}
                    >
                      {errorVersion.isLatest ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Bug className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-3">
                        <p
                          className={`text-lg font-bold ${
                            errorVersion.isLatest
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
                              : "bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400"
                          } bg-clip-text text-transparent`}
                        >
                          Version {errorVersion.id.replace("e-", "")}
                        </p>
                        {errorVersion.isLatest && (
                          <Chip
                            color="success"
                            variant="shadow"
                            size="sm"
                            className="font-semibold"
                          >
                            Latest Fixes
                          </Chip>
                        )}
                      </div>
                      <p className="text-small text-default-500">
                        {errorVersion.items.length} issues resolved
                      </p>
                    </div>
                  </CardHeader>
                  <Divider
                    className={
                      errorVersion.isLatest
                        ? "bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800"
                        : "bg-gradient-to-r from-orange-200 via-red-200 to-orange-200 dark:from-orange-800 dark:via-red-800 dark:to-orange-800"
                    }
                  />
                  <CardBody className="gap-4 pt-6 pb-6">
                    <div className="space-y-3">
                      {errorVersion.items.map((fix, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${
                            errorVersion.isLatest
                              ? "bg-white/60 dark:bg-gray-800/60 border-green-100 dark:border-green-900/50"
                              : "bg-white/50 dark:bg-gray-800/50 border-orange-100 dark:border-orange-900/50"
                          } backdrop-blur-sm shadow-sm`}
                        >
                          <CheckCircle2
                            size={20}
                            className={
                              errorVersion.isLatest
                                ? "text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                                : "text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                            }
                          />
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {fix}
                          </p>
                        </div>
                      ))}
                    </div>

                    {errorVersion.affectedPlatforms.length > 0 && (
                      <>
                        <Divider className="my-2" />
                        <div>
                          <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                            Affected Platforms:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {errorVersion.affectedPlatforms.map((platform) => (
                              <Chip
                                key={platform.id}
                                variant="flat"
                                color={errorVersion.isLatest ? "success" : "warning"}
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
                  </CardBody>
                </Card>
              </motion.div>
            ))}

          {/* Dependency Updates */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800 dark:text-gray-200">
              Dependency Status
            </h2>
          </motion.div>

          {updateMetadata.dependencySet.dependencies.map((dep) => (
            <motion.div key={dep.id} variants={itemVariants}>
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800 shadow-md">
                <CardHeader className="flex gap-3 pb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {dep.name}
                      </p>
                      <Chip
                        color={dep.isOptional ? "default" : "danger"}
                        variant="flat"
                        size="sm"
                      >
                        {dep.isOptional ? "Optional" : "Required"}
                      </Chip>
                    </div>
                    <p className="text-small text-default-500">
                      Latest: v{dep.version.online}
                    </p>
                  </div>
                </CardHeader>
                <Divider className="bg-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-800 dark:to-indigo-800" />
                <CardBody className="gap-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {dep.updateMessage}
                  </p>
                  {dep.updateLink && (
                    <Button
                      onPress={() => open(dep.updateLink)}
                      color="primary"
                      variant="flat"
                      size="sm"
                      endContent={<ExternalLink size={16} />}
                    >
                      Download {dep.name}
                    </Button>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
}
