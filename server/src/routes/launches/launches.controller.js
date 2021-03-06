const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json( await getAllLaunches());
}
async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  } else {
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
      return res.status(400).json({
        error: "Invalid launch date",
      });
    } else {
      await scheduleNewLaunch(launch);
      return res.status(201).json(launch);
    }
  }
}
async function httpAbortLaunch(req,res){
  const launchId = +req.params.id;
  const existsLaunch = await existsLaunchWithId(launchId);
  if(!existsLaunch){
    return res.status(404).json({
      error: 'Launch not found'
    });
  }
  else{
    const aborted = await abortLaunchById(launchId);
    return res.status(200).json(aborted);
  }

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};
