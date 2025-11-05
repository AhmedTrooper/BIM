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
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
          <CardHeader className="flex gap-3 pb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Application
              </p>
              <p className="text-small text-default-500">
                Current application details
              </p>
            </div>
          </CardHeader>
          <Divider className="bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 dark:from-blue-800 dark:via-indigo-800 dark:to-violet-800" />
          <CardBody className="gap-4 pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-blue-100 dark:border-blue-900/50">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">Name:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{appName || "Loading..."}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/50">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Version:
                </span>
                <Chip color="primary" variant="shadow" className="font-bold">
                  v{appVersion || "0.0.0"}
                </Chip>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <RefreshCw
                  className={clsx("w-5 h-5 text-blue-600 dark:text-blue-400", {
                    "animate-spin": isCheckingUpdate,
                  })}
                />
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Update Status:
                </span>
              </div>
              {getUpdateStatus()}
            </div>

            <div className="flex gap-3">
              <Button
                color="primary"
                variant="shadow"
                onPress={handleCheckUpdates}
                isLoading={isCheckingUpdate}
                startContent={!isCheckingUpdate && <RefreshCw size={18} />}
                className="flex-1 font-semibold"
              >
                Check for Updates
              </Button>

              {updateMetadata?.application.updateAvailable &&
                updateMetadata.application.updateUrl && (
                  <Button
                    color="success"
                    variant="shadow"
                    onPress={() => open(updateMetadata.application.updateUrl!)}
                    startContent={<Download size={18} />}
                    endContent={<ExternalLink size={16} />}
                    className="flex-1 font-semibold"
                  >
                    Download v{updateMetadata.application.version.online}
                  </Button>
                )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <CardHeader className="flex gap-3 pb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Connect & Explore
              </p>
              <p className="text-small text-default-500">Discover more content and resources</p>
            </div>
          </CardHeader>
          <Divider className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 dark:from-purple-800 dark:via-pink-800 dark:to-purple-800" />
          <CardBody className="gap-4 pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                as={motion.button}
                onPress={() => open(githubUrl)}
                className="h-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-white shadow-lg border border-gray-700"
                startContent={
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Github size={28} />
                  </div>
                }
                endContent={<ExternalLink size={18} className="opacity-70" />}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs opacity-70 font-medium">Explore My</span>
                  <span className="font-bold text-base">GitHub Profile</span>
                  <span className="text-xs opacity-60">@AhmedTrooper</span>
                </div>
              </Button>

              <Button
                as={motion.button}
                onPress={() => open(projectUrl)}
                className="h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-600 text-white shadow-lg border border-blue-400"
                startContent={
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Code size={28} />
                  </div>
                }
                endContent={<ExternalLink size={18} className="opacity-70" />}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.5)",
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs opacity-80 font-medium">Browse</span>
                  <span className="font-bold text-base">Source Code</span>
                  <span className="text-xs opacity-70">Open Source on GitHub</span>
                </div>
              </Button>

              <Button
                as={motion.button}
                onPress={() => open(youtubeUrl)}
                className="h-24 bg-gradient-to-br from-red-600 via-red-500 to-rose-500 dark:from-red-700 dark:via-red-600 dark:to-rose-600 text-white shadow-lg border border-red-400"
                startContent={
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Youtube size={28} />
                  </div>
                }
                endContent={<ExternalLink size={18} className="opacity-70" />}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.5)",
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs opacity-80 font-medium">Watch</span>
                  <span className="font-bold text-base">YouTube Channel</span>
                  <span className="text-xs opacity-70">Tutorials & Videos</span>
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="flex gap-3 pb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Operating System
              </p>
              <p className="text-small text-default-500">
                System platform information
              </p>
            </div>
          </CardHeader>
          <Divider className="bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800" />
          <CardBody className="gap-4 pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-green-100 dark:border-green-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Platform:
                </span>
                <Chip color="primary" variant="shadow" className="capitalize font-semibold">
                  {platform || "Unknown"}
                </Chip>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Version:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{osVersion || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-teal-100 dark:border-teal-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Architecture:
                </span>
                <Chip variant="shadow" className="uppercase font-semibold">
                  {arch || "Unknown"}
                </Chip>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-green-100 dark:border-green-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">Type:</span>
                <span className="font-bold capitalize text-green-600 dark:text-green-400">
                  {osType || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-2">
                  <Globe size={16} className="text-emerald-500" />
                  Locale:
                </span>
                <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{locale}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-teal-100 dark:border-teal-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Device Type:
                </span>
                <Chip color={isMobileOS ? "warning" : "success"} variant="shadow" className="font-semibold">
                  {isMobileOS ? "Mobile" : "Desktop"}
                </Chip>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-green-100 dark:border-green-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-green-500" />
                  Hostname:
                </span>
                <span className="font-bold font-mono text-sm text-green-600 dark:text-green-400">
                  {hostname}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-2">
                  <Code size={16} className="text-emerald-500" />
                  OS Family:
                </span>
                <span className="font-bold capitalize text-emerald-600 dark:text-emerald-400">
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
