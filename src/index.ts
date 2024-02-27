import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Ci {

  /**
   * example usage: "dagger call ci --source ."
   */
  @func()
  async ci(source: Directory): Promise<string> {
    // Use Golang module
    var goProject = dag.golang().withProject(source)

    // Run Go tests
    await goProject.test()

    // Get container with built binaries
    var image = await goProject.buildContainer()

    // Push image to a registry
    var ref = await image.publish("ttl.sh/demoapp:1h")
    //
    // Scan image for vulnerabilities
    return dag.trivy().scanContainer(dag.container().from(ref))
  }
}
