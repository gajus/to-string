var loaderUtils = require("loader-utils");

/**
 * @see https://webpack.github.io/docs/loaders.html
 */
module.exports = function() {}

/**
 * @see https://webpack.github.io/docs/loaders.html#pitching-loader
 */
module.exports.pitch = function(remainingRequest) {
    if (this.cacheable) {
        this.cacheable();
    }
    const query = loaderUtils.parseQuery(this.query);

    return `
        var result = require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)});

        if (result && result.__esModule) {
            result = result.default;
        }

        if (typeof result === "string") {
            module.exports = result;
        } else if (${query.sourceMap}) {
            module.exports = [
              result[0][1],
              "\\n\\n/\\\*\#\\n",
              "sourceMappingURL=data:application/json;base64,",
              btoa(JSON.stringify(result[0][3])),
              " */"
            ].join("");
        } else {
            module.exports = result.toString();
        }
    `;
};
