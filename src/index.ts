import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Ci {

  /**
   * example usage: "dagger call ci --source ."
   */
  @func()
  async ci(source: Directory): Promise<string> {
    // Use Golang module to configure project
    var goProject = dag.golang().withProject(source)

    // Run Go tests using Golang module
    await goProject.test()

    // Get container with built binaries using Golang module
    var image = await goProject.buildContainer()

    // Push image to a registry using core Dagger API
    var ref = await image.publish("ttl.sh/demoapp:1h")

    // Scan image for vulnerabilities using Trivy module
    return dag.trivy().scanContainer(dag.container().from(ref))
  }
}


