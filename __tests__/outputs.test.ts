import * as core from "@actions/core";
import { setOutputs } from "../src/output";

describe("setOutputs", () => {
    it("should set the version and changelog outputs", () => {
        // Arrange
        const data = {
            version: "1.0.0",
            changelog: "## [1.0.0] - 2023-04-28\n\n- Initial release\n",
        };
        jest.spyOn(core, "setOutput");

        // Act
        setOutputs(data);

        // Assert
        expect(core.setOutput).toHaveBeenCalledTimes(2);
        expect(core.setOutput).toHaveBeenCalledWith("version", "1.0.0");
        expect(core.setOutput).toHaveBeenCalledWith(
            "changelog",
            "## [1.0.0] - 2023-04-28\n\n- Initial release\n"
        );
    });
});
