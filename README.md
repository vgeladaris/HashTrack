# This API is under development and not yet fully functional.



## What is it?

**HashTrack** is an API that lets you track anything on a map with real-time updates. </br>
It can be used by any business delivering a product. </br>

The two key features are:
* Providing the client with a map showing the delivery person's location, getting real-time updates
* Providing the delivery person with an optimized route to the client


## How does it work?
### Request
With every new order about to get delivered, you can send an HTTP POST request to the API with the following format:

```
https://us-central1-hashtrackapi.cloudfunctions.net/app/api/v1/create/destination/timeout
```

Where `destination` is a string of the client's address (e.g. **Vasiliou+Smpokou+1+71306+Heraklion+Greece**) </br>
and `timeout` is the number of hours for the tracking to be active (e.g. **3** hours).

_If you set the `timeout` to **0**, then the tracking will not be deactivated on its own, instead the delivery person must declare the delivery as completed._

### Response
If the request is valid, the API will respond with a json file containing:
* _id_: The order's ID.
* _clientUrl_: A link that you can send to the client. It contains a map along with a pin marking the delivery person's position, the position will update every 5-10 seconds.
* _driverUrl_: A link for the delivery person. When the link is open, the device will broadcast its location for the client to see. It contains a map along with an optimal route for the client's address and a button for declaring the delivery as completed. When the delivery person completes the delivery, he can press the button and the two links will be deactivated.
* _timeout_: The order's timeout value. </br>

JSON Response for the example values above:
```
{
    "id": "eFOs8pH9",
    "clientUrl": "https://us-central1-hashtrackapi.cloudfunctions.net/app/api/v1/track/eFOs8pH9/c",
    "driverUrl": "https://us-central1-hashtrackapi.cloudfunctions.net/app/api/v1/track/eFOs8pH9/d",
    "timeout": 3
}

```

_Notes:_
* The client's link can be used by multiple devices.
* The delivery person's link can only be used by the delivery person's device.
* The link should not be closed at any point during delivery.
* If an order's timeout value is not **0** and is not declared as completed within a few days, it will be deactivated automatically.
