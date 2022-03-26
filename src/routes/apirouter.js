const express = require('express');
const router = express.Router();
const si = require("systeminformation");
const os = require("os");

router.get('/', async function(req, res){
   res.json({ status: 200, message: 'Welcome to the api router :welp:' });
});

router.get('/v1/stats', async function(req,res){
    let NetworkIn = 0;
    let NetworkOut = 0;
    let NetworkInSec = 0;
    let NetworkOutSec = 0;
    let CpuUsage = 0;
    let TotalMem = 0;
    let UsedMem = 0;
    let TotalDisk = 0;
    let UsedDisk = 0;
    let TotalSwap = 0;
    let UsedSwap = 0;
    let SystemLoad = 0;
    let NetworkLatency = 0;
    let OsUptime = si.time();

    function convertSeconds(seconds) {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);

      var dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    await si.currentLoad().then((systemLoad) => {
      CpuUsage = Math.round(systemLoad.currentLoad);
      SystemLoad = Math.round(systemLoad.avgLoad);
    });

    await si.fsSize().then((diskInfo) => {
      TotalDisk = diskInfo[0].size;
      UsedDisk = diskInfo[0].used;
    });

    await si.mem().then((memoryInfo) => {
      TotalMem = memoryInfo.total;
      UsedMem = memoryInfo.used;
      TotalSwap = memoryInfo.swaptotal;
      UsedSwap = memoryInfo.swapused;
    });

    await si.networkStats().then((networkStats) => {
      NetworkIn = networkStats[0].rx_bytes;
      NetworkOut = networkStats[0].tx_bytes;
      NetworkInSec = networkStats[0].rx_sec;
      NetworkOutSec = networkStats[0].tx_sec;
    });
    
    await si.inetLatency().then((Data) => NetworkLatency = Data);

    const hostname = await os.hostname()
    
    let convertUptime = await convertSeconds(OsUptime.uptime);
    return await res.json({
        name: hostname,
        uptime: convertUptime,
        network_rx: NetworkIn,
        network_tx: NetworkOut,
        network_rx_sec: NetworkInSec,
        network_tx_sec: NetworkOutSec,
        cpu: CpuUsage,
        memory_total: TotalMem,
        memory_used: UsedMem,
        swap_total: TotalSwap,
        swap_used: UsedSwap,
        disk_total: TotalDisk,
        disk_used: UsedDisk,
        ping: Math.round(NetworkLatency),
    })
})
router.get('/v1/stats/cpu', async function(req,res){
    const cpu = await os.cpus()

    return await res.json({
        cpu: cpu,
    })
})

router.get('/v1/stats/network', async function(req,res){

    let NetworkIn = 0;
    let NetworkOut = 0;
    let NetworkInSec = 0;
    let NetworkOutSec = 0;

    await si.networkStats().then((networkStats) => {
        NetworkIn = networkStats[0].rx_bytes;
        NetworkOut = networkStats[0].tx_bytes;
        NetworkInSec = networkStats[0].rx_sec;
        NetworkOutSec = networkStats[0].tx_sec;
    });

    return await res.json({
        network_rx: NetworkIn,
        network_tx: NetworkOut,
        network_rx_sec: NetworkInSec,
        network_tx_sec: NetworkOutSec,
    })
})

module.exports = router;