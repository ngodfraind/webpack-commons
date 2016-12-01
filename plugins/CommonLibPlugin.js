var path = require('path')

function CommonLibPlugin(libs) {
    //carefull
    this.libs = libs.map(lib => path.join(__dirname, '..', lib))
    console.error(libs)
}

CommonLibPlugin.prototype.apply = function(compiler) {
    var libs = this.libs
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin(['optimize-chunks', 'optimize-extracted-chunks'], function(chunks) {
            var blocks = {}
            chunks.forEach(chunk => {
                //console.error(chunk)
                var toRemove = []
                chunk.modules.forEach(module => {
                    //console.error('NAME : ' + module.resource)
                    //console.error('====================================================')
                    //console.error(module.dependencies)
                    if (libs.indexOf(module.resource) > -1)  {
                        blocks[module.resource] = module
                        toRemove.push(module)
                    }
                })

                toRemove.forEach(module => chunk.removeModule(module))
            })

            Object.keys(blocks).forEach((key, index) => {
                var block = blocks[key]
                chunk = this.addChunk('chunk' + index);
                chunk.entry = true
                chunk.addModule(block)
            })
        });
    });
}

module.exports = CommonLibPlugin
