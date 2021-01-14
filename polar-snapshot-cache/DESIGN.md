The general design is to create a NEW firestore driver instance that uses our
caching infra rather than the stock one.

So something like




const firestore = await CachingStores.create(Firestore.getInstance(), cacheKeyCalculator);

... this will then create a wrapped firestore interface that behaves just like the regular
firestore API only it uses an internal cache.

