import dagger
from dagger import dag, function, object_type

@object_type
class Ci:
    @function
    async def ci(self, source: dagger.Directory) -> str:
        # Use Golang module to configure project
        go_project = dag.golang().with_project(source)

        # Run Go tests using Golang module
        await go_project.test()

        # Get container with built binaries using Golang module
        image = await go_project.build_container()

        # Push image to a registry using core Dagger API
        ref = await image.publish("ttl.sh/demoapp:1h")

        # Scan image for vulnerabilites using Trivy module
        return await dag.trivy().scan_container(dag.container().from_(ref))
