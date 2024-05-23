#!/usr/bin/env python3
"""
    Basic dictionary caching
"""
BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """
        The caching class
    """
    def __init__(self):
        """The init method"""
        super().__init__()

    def put(self, key, item):
        """insert into cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > self.MAX_ITEMS:
            dis = self.cache_data.pop(list(self.cache_data.keys())[0])
            print(f"DISCARD: {dis}")

    def get(self, key):
        """Retrieve the cached data"""
        if key is None:
            return None
        return self.cache_data.get(key)
