#!/usr/bin/env python3
"""
    Basic dictionary caching
"""
from collections import OrderedDict
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
        The caching class
    """
    def __init__(self):
        """The init method"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """insert into cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > self.MAX_ITEMS:
            poped = next(iter(self.cache_data))
            del self.cache_data[poped]
            print(f"DISCARD: {poped}")
        self.cache_data[key] = item

    def get(self, key):
        """Retrieve the cached data"""
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
            return self.cache_data.get(key, None)

