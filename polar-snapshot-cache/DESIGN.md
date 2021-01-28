The general design is to create a NEW firestore driver instance that uses our
caching infra rather than the stock one.

The stock one has a N^2 scaling bug due to their inability to support local indexes.

They just scan ALL the local data which makes every query slow, even if it's something
like just accessing preferences.  

So something like

const firestore = await CachingStores.create(Firestore.getInstance(), cacheKeyCalculator);

This will take the Firestore instance, which is structurally the same as IStore and has
a collection() method which is all we really use as the main interface when using 
firestore anyway.

... this will then create a wrapped firestore interface that behaves just like the regular
firestore API only it uses an internal cache.

The SnapshotCacheProvider interface can provide different caching strategies
including, none, localStorage, and idb.  

The idb library provides an Indexed DB API that we can use rather than localStorage 
(which blocks) but initially I don't think we really need that since this will be much
much faster than what we already have.


FIXME: this design doesn't store NEGATIVE cache entries.. so if 'exists' is
false we dont' store anything , just remove it.  We need to add support for that
too by usign a 'holder' which would have an 'undefined' value.

