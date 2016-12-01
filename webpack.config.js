var path = require("path");
var CommonLibPlugin = require('./plugins/CommonLibPlugin')
var VendorPlugin = require('./plugins/VendorPlugin')

var config = {
    'lib1': ['./lib1.js'],
    'lib2': ['./lib2.js'],
    'lib3': ['./lib3.js'],
    'ven1': ['./vendor/vendor1.1.js', './vendor/vendor1.2.js'],
    'ven2': ['./vendor/vendor2.1.js', './vendor/vendor2.2.js']
}

module.exports = {
	entry: {
		a: './a.js',
		b: './b.js',
		c: './c.js'
	},
	output: {
		path: path.join(__dirname, "js"),
		filename: "[name].js"
	},
	plugins: [
		new CommonLibPlugin(['./lib1.js', './lib2.js'])
        //new VendorPlugin(config)
	]
};
