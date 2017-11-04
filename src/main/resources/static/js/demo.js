/**
 * Created by ss on 2017/10/30.
 */

$(function () {

    googleEarth = false;
    infoBoard = false;

    renderer = SolarEPUtils.getDefaultRenderer();


    solarSystemSceneController = new SolarSystemSceneController(renderer);
    solarSystemSceneController.activateScene();

    // $.getScript("../data/mockTop10Data.js");
    // $.getScript("../js/config/planetConfig.js");
    // $.getScript("../js/model/PlanetSceneControllers.js");
    // $.getScript("../js/model/GlobeSceneController.js");

    mercurySceneController = new PlanetSceneController(renderer, PlanetConfig.mercury);
    venusSceneController = new PlanetSceneController(renderer, PlanetConfig.venus);
    earthSceneController = new EarthSceneController(renderer);
    marsSceneController = new PlanetSceneController(renderer, PlanetConfig.mars);
    jupiterSceneController = new PlanetSceneController(renderer, PlanetConfig.jupiter);
    saturnSceneController = new PlanetSceneController(renderer, PlanetConfig.saturn);
    uranusSceneController = new PlanetSceneController(renderer, PlanetConfig.uranus);
    neptuneSceneController = new PlanetSceneController(renderer, PlanetConfig.neptune);
    plutoSceneController = new PlanetSceneController(renderer, PlanetConfig.pluto);

    // mercurySceneController = new MercurySceneController(renderer);
    // venusSceneController = new VenusSceneController(renderer);
    // earthSceneController = new EarthSceneController(renderer);
    // marsSceneController = new MarsSceneController(renderer);
    // jupiterSceneController = new JupiterSceneController(renderer);
    // saturnSceneController = new SaturnSceneController(renderer);
    // uranusSceneController = new UranusSceneController(renderer);
    // neptuneSceneController = new NeptuneSceneController(renderer);
    // plutoSceneController = new PlutoSceneController(renderer);

    solarSystemSceneController.setPlanetScene("mercury", mercurySceneController);
    solarSystemSceneController.setPlanetScene("venus", venusSceneController);
    solarSystemSceneController.setPlanetScene("earth", earthSceneController);
    solarSystemSceneController.setPlanetScene("mars", marsSceneController);
    solarSystemSceneController.setPlanetScene("jupiter", jupiterSceneController);
    solarSystemSceneController.setPlanetScene("saturn", saturnSceneController);
    solarSystemSceneController.setPlanetScene("uranus", uranusSceneController);
    solarSystemSceneController.setPlanetScene("neptune", neptuneSceneController);
    solarSystemSceneController.setPlanetScene("pluto", plutoSceneController);


    globe = new DAT.Globe(renderer);
    globe.setSurfaceImg("../images/world.jpg");
    globe.init();
    loadData();

    $("#all").click(function () {
        $("body footer div").each(function () {
            $(this).attr("class", "unchecked");
        });
        $(this).attr("class", "checked");
        googleEarth = true;
        globe.activateScene();

    });

    $("body footer div.year").click(function () {
        $("body footer div").each(function () {
            $(this).attr("class", "unchecked");
        });
        $(this).attr("class", "checked");
        var year = $(this).text();

        if (googleEarth) {
            googleEarth = false;
            earthSceneController.activateScene()
        }

        getYearData(year);
    });

    $("#backLogo").click(function () {
        solarSystemSceneController.activateScene();
        $("#timeLine").hide();
    });

    $("#closeBoard").click(function () {
        if (infoBoard) {
            earthSceneController.restoreScene();
            $("#infoBoard").animate({width:'toggle'},350);
            $("#curtain").hide();
            $("#timeLine").show();
            infoBoard = false;
        }
    });

    $("#curtain").click(function() {
        if (infoBoard) {
            earthSceneController.restoreScene();
            $("#infoBoard").animate({width:'toggle'},350);
            $("#curtain").hide();
            $("#timeLine").show();
            infoBoard = false;
        }
    });
});

function getYearData(year) {

    if (Math.random() > 0.5) {
        earthSceneController.addCones(geographicData);
    } else {
        earthSceneController.clearCones();
    }
}

function loadData() {

    $.ajax({
        url: '../data/rank.json',
//            url: '/api/all',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: 'json',
        success: function (data) {
            globe.addData(data, {format: 'magnitude'});
            globe.createPoints();
        }
    });
}