package swim.cellular.map;

public class SphericalMercator {

    private SphericalMercator() {
        // static
    }

    public static final double MAX_LAT = Math.atan(Math.sinh(Math.PI));

    public static double projectLng(double lng) {
        return SphericalMercator.scale(Math.toRadians(lng));
    }

    public static double projectLat(double lat) {
        return SphericalMercator.scale(Math.log(Math.tan(Math.PI / 4.0 + Math.min(Math.max(-MAX_LAT, Math.toRadians(lat)), MAX_LAT) / 2.0)));
    }

    static double scale(double x) {
        return (Math.min(Math.max(-Math.PI, x), Math.PI) + Math.PI) / (Math.PI * 2.0);
    }

    public static double unprojectX(double x) {
        return SphericalMercator.round(Math.toDegrees(SphericalMercator.unscale(x)));
    }

    public static double unprojectY(double y) {
        return SphericalMercator.round(Math.toDegrees(Math.atan(Math.exp(SphericalMercator.unscale(y))) * 2.0 - Math.PI / 2.0));
    }

    static double unscale(double x) {
        return x * (Math.PI * 2.0) - Math.PI;
    }

    static double round(double value) {
        return (double) Math.round(value * 100000000.0) / 100000000.0;
    }

}