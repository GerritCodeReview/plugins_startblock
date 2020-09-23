package_group(
    name = "visibility",
    packages = ["//plugins/startblock/..."],
)

package(default_visibility = [":visibility"])

load(
    "//tools/bzl:plugin.bzl",
    "gerrit_plugin",
)
load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "polygerrit_plugin")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")

gerrit_plugin(
    name = "startblock",
    srcs = glob(["java/com/google/gerrit/plugins/startblock/**/*.java"]),
    manifest_entries = [
        "Gerrit-PluginName: startblock",
        "Gerrit-Module: com.google.gerrit.plugins.startblock.Module",
    ],
    resource_jars = [":startblock-fe-static"],
    resource_strip_prefix = "plugins/startblock/resources",
    resources = glob(["resources/**/*"]),
)

polygerrit_plugin(
    name = "startblock-fe",
    app = "plugin-bundle.js",
    plugin_name = "startblock",
)

rollup_bundle(
    name = "plugin-bundle",
    srcs = glob([
        "ui/**/*.js",
    ]),
    entry_point = "ui/plugin.js",
    format = "iife",
    rollup_bin = "//tools/node_tools:rollup-bin",
    sourcemap = "hidden",
    deps = [
        "@tools_npm//rollup-plugin-node-resolve",
    ],
)

genrule2(
    name = "startblock-fe-static",
    srcs = [":startblock-fe"],
    outs = ["startblock-fe-static.jar"],
    cmd = " && ".join([
        "mkdir $$TMP/static",
        "cp -r $(locations :startblock-fe) $$TMP/static",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)