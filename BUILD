package_group(
    name = "visibility",
    packages = ["//plugins/code-owners/..."],
)

package(default_visibility = [":visibility"])

load(
    "//tools/bzl:plugin.bzl",
    "gerrit_plugin",
)

gerrit_plugin(
    name = "startblock",
    srcs = glob(["java/com/google/gerrit/plugins/startblock/**/*.java"]),
    manifest_entries = [
        "Gerrit-PluginName: startblock",
        "Gerrit-Module: com.google.gerrit.plugins.startblock.Module",
    ],
    resource_strip_prefix = "plugins/startblock/resources",
    resources = glob(["resources/**/*"]),
)

