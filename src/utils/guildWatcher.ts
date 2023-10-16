// Create document every day at 00:00
// Populate document every minute with server count to catch early leavers (done)
// Store document id for one day (update on bot reload) to not search every minute
// Check when bot is added and removed

/*

https://www.mongodb.com/docs/manual/core/timeseries/timeseries-procedures/

Document: (Date eg: 151023)
    _id: 1111111111
    Server count :[ {Time:00:00, Count:Number}, {Time:00:30, Count:Number}, ... , {Time:23:30, Count:Number} ] //Time is in 30 minutes intervals
    or Server count :[ {0000:CountNumber}, {0030:CountNumber}, ... , {2330:CountNumber} ] //Time is in 30 minutes intervals

*/
