var path = require('path')

function CommonLibPlugin(commons) {
    //carefull
    this.commons = commons.map(common => path.join(__dirname, '..', common))
}

CommonLibPlugin.prototype.apply = function(compiler) {
    var commons = this.commons
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin(['optimize-chunks', 'optimize-extracted-chunks'], function(chunks) {
            var libraries = []

            chunks.forEach(chunk => {
                var toRemove = []
                chunk.modules.forEach(module => {
                    if (commons.indexOf(module.resource) > -1)  {
                        var library = libraries.find(library => library.module === module)

                        if (!library) {
                            library = {
                                module: module,
                                dependencies: findLibDependencies(module),
                                chunks: [chunk]
                            }

                            libraries.push(library)
                        } else {
                            library.chunks.push(chunk)
                        }
                    }
                })
            })

            libraries.forEach((library, index) => {
                var count = index + 1
                var name = 'lib' + count
                chunk = this.addChunk(name);
                chunk.common = true
                chunk.addModule(library.module)
                chunk.entry = true
                chunk.initial = true
                library.dependencies.forEach(dependency => {
                    chunk.addModule(dependency)
                })
            })

            chunks.forEach(chunk => {
                if (!chunk.common) {
                    libraries.forEach(library => {
                        library.dependencies.forEach(module => chunk.removeModule(module))
                        chunk.removeModule(library.module)
                    })
                }
            });

            console.error(chunks)
        })
    })

}

function findLibDependencies(module, dependencies) {
    dependencies = dependencies || []
    if (!module) return dependencies;

    module.dependencies.forEach((dependency, idx) => {
        if (dependency.module) {
            if (dependencies.indexOf(dependency.module) === -1) {
                dependencies.push(dependency.module)
                findLibDependencies(dependency.module, dependencies)
            }
        }
    })

    return dependencies
}

function displayModules(modules) {
    console.error('---------------------- DISPLAY ---------------------------')
    modules.forEach(module => console.error(module.resource))
}

module.exports = CommonLibPlugin
