#!/usr/bin/env python3
"""
    Basic dictionary caching
"""
from collections import OrderedDict
from base_caching import BaseCaching


class MRUCache(BaseCaching):
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

    def get(self, key):
        """Retrieve the cached data"""
        if key is None:
            return None
        return self.cache_data.get(key)
