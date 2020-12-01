# This API is under development and not yet fully functional.

![Logo](https://raw.githubusercontent.com/VasileiosGeladaris/HashTrack/main/logo.png)

## What is it?

**HashTrack** is an API that lets you track anything on a map with real-time updates. </br>
It can be used by any business delivering a product. </br>

The two key features are:
* Providing the client with a map showing the driver's location, getting real-time updates
* Providing the driver with an optimized route to the client


## How does it work?
### Request
With every new order about to get delivered, you can send an HTTP POST request to the API with the following format:

```
https://us-central1-hashtrackapi.cloudfunctions.net/app/api/v1/create/destination
```

Where `destination` is a string of the client's address (e.g. **Vasiliou+Smpokou+1+71306+Heraklion+Greece**)

### Response
If the request is valid, the API will respond with a json file containing:
* _id_: The order's ID.
* _clientUrl_: A link that you can send to the client. It contains a map along with a pin marking the driver's position, the position will update every 5-10 seconds.
* _driverUrl_: A link for the driver. When the link is open, the device will broadcast its location for the client to see. It contains a map along with an optimal route for the client's address and a button for declaring the delivery as completed. When the driver completes the delivery, they can press the button and the two links will be deactivated.

JSON Response for the example values above:
```
{
    "id": "eFOs8pH9",
    "clientUrl": "https://us-central1-hashtrackapi.cloudfunctions.net/app/api/v1/track/eFOs8pH9/c",
    "driverUrl": "https://us-central1-hashtrackapi.cloudfunctions.net/app/api/v1/track/eFOs8pH9/d"
}

```

### Notes
* The client's link can be used by multiple devices.
* The driver's link must only be used by his device only.
* The link should not be closed at any point during delivery.
