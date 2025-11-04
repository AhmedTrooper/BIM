import { useEffect } from "react";
import { motion } from "framer-motion";
import { useApplicationStore } from "@/store/ApplicationStore";
import useOsInfoStore from "@/store/OsInfoStore";
import { EDependencyStatus } from "@/interface/metadata/DependencyInterface";
import { open } from "@tauri-apps/plugin-shell";
import {
  Monitor,
  Cpu,
  HardDrive,
  Package,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Smartphone,
  Laptop,
  Globe,
  MapPin,
  Code,
  Calendar,
  Github,
  Youtube,
  Link as LinkIcon,
} from "lucide-react";
import clsx from "clsx";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Button,
} from "@heroui/react";

export default function Info() {
  const appName = useApplicationStore((state) => state.appName);
  const appVersion = useApplicationStore((state) => state.appVersion);
  const githubUrl = useApplicationStore((state) => state.githubUrl);
  const projectUrl = useApplicationStore((state) => state.projectUrl);
  const youtubeUrl = useApplicationStore((state) => state.youtubeUrl);
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
  const isCheckingUpdate = useApplicationStore(
    (state) => state.isCheckingUpdate
  );
  const checkForUpdates = useApplicationStore((state) => state.checkForUpdates);
  const fetchAppInfo = useApplicationStore((state) => state.fetchAppInfo);

  const isMobileOS = useOsInfoStore((state) => state.isMobileOS);
  const platform = useOsInfoStore((state) => state.platform);
  const osVersion = useOsInfoStore((state) => state.version);
  const arch = useOsInfoStore((state) => state.arch);
  const osType = useOsInfoStore((state) => state.type);
  const locale = useOsInfoStore((state) => state.locale);
  const hostname = useOsInfoStore((state) => state.hostname);
  const family = useOsInfoStore((state) => state.family);
  const osFetched = useOsInfoStore((state) => state.osFetched);
  const fetchOsInfo = useOsInfoStore((state) => state.fetchOsInfo);

  useEffect(() => {
    if (!appName) fetchAppInfo();
    if (!osFetched) fetchOsInfo();
  }, []);

  const handleCheckUpdates = async () => {
    await checkForUpdates();
  };

  const getPlatformIcon = () => {
    if (isMobileOS) return <Smartphone className="w-6 h-6" />;
    return <Laptop className="w-6 h-6" />;
  };

  const getUpdateStatus = () => {
    if (!updateMetadata) return null;

    if (updateMetadata.application.updateAvailable) {
      return (
        <Chip
          color="danger"
          variant="flat"
          startContent={<AlertCircle size={16} />}
        >
          Update Available: v{updateMetadata.application.version.online}
        </Chip>
      );
    }

    return (
      <Chip
        color="success"
        variant="flat"
        startContent={<CheckCircle size={16} />}
      >
        Up to Date
      </Chip>
    );
  };

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

  return (
    <motion.div
      className="p-6 space-y-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold">System Information</h1>
        {getPlatformIcon()}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-zinc-50 dark:bg-zinc-800">
          <CardHeader className="flex gap-3">
            <Package className="w-6 h-6 text-blue-500" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Application</p>
              <p className="text-small text-default-500">
                Current application details
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">Name:</span>
                <span className="font-semibold">{appName || "Loading..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Version:
                </span>
                <span className="font-semibold">v{appVersion || "0.0.0"}</span>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw
                  className={clsx("w-5 h-5", {
                    "animate-spin": isCheckingUpdate,
                  })}
                />
                <span className="text-zinc-600 dark:text-zinc-400">
                  Update Status:
                </span>
              </div>
              {getUpdateStatus()}
            </div>

            <Button
              color="primary"
              variant="flat"
              onPress={handleCheckUpdates}
              isLoading={isCheckingUpdate}
              startContent={!isCheckingUpdate && <RefreshCw size={18} />}
            >
              Check for Updates
            </Button>

            {updateMetadata?.application.updateAvailable &&
              updateMetadata.application.updateUrl && (
                <Button
                  color="success"
                  variant="solid"
                  as="a"
                  href={updateMetadata.application.updateUrl}
                  target="_blank"
                  startContent={<Download size={18} />}
                  endContent={<ExternalLink size={16} />}
                >
                  Download v{updateMetadata.application.version.online}
                </Button>
              )}
          </CardBody>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 border-2 border-blue-200 dark:border-blue-900">
          <CardHeader className="flex gap-3">
            <LinkIcon className="w-6 h-6 text-purple-500" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Connect & Explore</p>
              <p className="text-small text-default-500">Links and resources</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                as={motion.button}
                onPress={() => open(githubUrl)}
                className="h-20 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white"
                startContent={<Github size={24} />}
                endContent={<ExternalLink size={16} />}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">Visit My</span>
                  <span className="font-bold">GitHub Profile</span>
                </div>
              </Button>

              <Button
                as={motion.button}
                onPress={() => open(projectUrl)}
                className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white"
                startContent={<Code size={24} />}
                endContent={<ExternalLink size={16} />}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">View</span>
                  <span className="font-bold">Project Source</span>
                </div>
              </Button>

              <Button
                as={motion.button}
                onPress={() => open(youtubeUrl)}
                className="h-20 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white"
                startContent={<Youtube size={24} />}
                endContent={<ExternalLink size={16} />}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">Subscribe to</span>
                  <span className="font-bold">YouTube Channel</span>
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-zinc-50 dark:bg-zinc-800">
          <CardHeader className="flex gap-3">
            <Monitor className="w-6 h-6 text-green-500" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Operating System</p>
              <p className="text-small text-default-500">
                System platform information
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Platform:
                </span>
                <Chip color="primary" variant="flat" className="capitalize">
                  {platform || "Unknown"}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Version:
                </span>
                <span className="font-semibold">{osVersion || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Architecture:
                </span>
                <Chip variant="flat" className="uppercase">
                  {arch || "Unknown"}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">Type:</span>
                <span className="font-semibold capitalize">
                  {osType || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Globe size={16} />
                  Locale:
                </span>
                <span className="font-semibold uppercase">{locale}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Device Type:
                </span>
                <Chip color={isMobileOS ? "warning" : "success"} variant="flat">
                  {isMobileOS ? "Mobile" : "Desktop"}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <MapPin size={16} />
                  Hostname:
                </span>
                <span className="font-semibold font-mono text-sm">
                  {hostname}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Code size={16} />
                  OS Family:
                </span>
                <span className="font-semibold capitalize">
                  {family || "N/A"}
                </span>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Calendar size={16} />
                  Last Boot:
                </span>
                <span className="font-semibold text-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">
                  User Agent:
                </span>
                <span
                  className="font-mono text-xs truncate max-w-[200px]"
                  title={navigator.userAgent}
                >
                  {navigator.userAgent.split(" ")[0]}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {updateMetadata?.dependencySet.dependencies &&
        updateMetadata.dependencySet.dependencies.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-zinc-50 dark:bg-zinc-800">
              <CardHeader className="flex gap-3">
                <HardDrive className="w-6 h-6 text-purple-500" />
                <div className="flex flex-col">
                  <p className="text-md font-semibold">Dependencies</p>
                  <p className="text-small text-default-500">
                    Required software and tools
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {updateMetadata.dependencySet.dependencies.map(
                    (dep, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold capitalize">
                            {dep.name}
                          </span>
                          {dep.version.status ===
                            EDependencyStatus.UpToDate && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {dep.version.status ===
                            EDependencyStatus.Outdated && (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          )}
                          {dep.version.status ===
                            EDependencyStatus.NotInstalled && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          {dep.version.status === EDependencyStatus.Error && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Current:</span>
                            <span className="font-mono">
                              {dep.version.current || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Required:</span>
                            <span className="font-mono">
                              {dep.version.online}
                            </span>
                          </div>
                          {dep.isOptional && (
                            <Chip
                              size="sm"
                              color="default"
                              variant="flat"
                              className="text-xs"
                            >
                              Optional
                            </Chip>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

      {updateMetadata && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {updateMetadata.featureSet.features.length > 0 && (
              <Card className="bg-zinc-50 dark:bg-zinc-800">
                <CardHeader className="flex gap-3">
                  <Cpu className="w-6 h-6 text-cyan-500" />
                  <div className="flex flex-col">
                    <p className="text-md font-semibold">Latest Features</p>
                    <p className="text-small text-default-500">
                      {updateMetadata.featureSet.features.reduce(
                        (acc: number, f: any) => acc + f.items.length,
                        0
                      )}{" "}
                      new features
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {updateMetadata.featureSet.features
                    .flatMap((feature: any) =>
                      feature.items.map((item: string) => ({
                        description: item,
                        id: feature.id,
                      }))
                    )
                    .slice(0, 5)
                    .map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature.description}</span>
                      </div>
                    ))}
                </CardBody>
              </Card>
            )}

            {updateMetadata.errorSet.errors.length > 0 && (
              <Card className="bg-zinc-50 dark:bg-zinc-800">
                <CardHeader className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="flex flex-col">
                    <p className="text-md font-semibold">Fixed Issues</p>
                    <p className="text-small text-default-500">
                      {updateMetadata.errorSet.errors.reduce(
                        (acc: number, e: any) => acc + e.items.length,
                        0
                      )}{" "}
                      bugs fixed
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {updateMetadata.errorSet.errors
                    .flatMap((error: any) =>
                      error.items.map((item: string) => ({
                        description: item,
                        id: error.id,
                      }))
                    )
                    .slice(0, 5)
                    .map((error: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      >
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error.description}</span>
                      </div>
                    ))}
                </CardBody>
              </Card>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
