/*–––––––––––––––––––––––––PERMISSIONS IMPORTS–––––––––––––––––––––––––*/
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

/*–––––––––––––––––––––––––CAMERA PERMISSIONS CLASS–––––––––––––––––––––––––*/
class UserPermissions {
  getCameraPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status != "granted") {
        alert("Access to Camera Roll Required to Set Profile Picture");
      }
    }
  };
}

export default new UserPermissions();
