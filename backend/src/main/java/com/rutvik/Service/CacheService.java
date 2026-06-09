package com.rutvik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    @Autowired
    private CacheManager cacheManager;

    @Scheduled(fixedRate = 600000) // 10 minutes
    @CacheEvict(value = "top50Coins", allEntries = true)
    public void refreshTop50Cache() {
        System.out.println("⏰ Scheduled: Top 50 cache cleared");
    }

    @Scheduled(fixedRate = 300000) // 5 minutes
    @CacheEvict(value = "coinList", allEntries = true)
    public void refreshCoinListCache() {
        System.out.println("⏰ Scheduled: Coin list cache cleared");
    }

    @Scheduled(fixedRate = 120000) // 2 minutes
    @CacheEvict(value = "marketChart", allEntries = true)
    public void refreshMarketChartCache() {
        System.out.println("⏰ Scheduled: Market chart cache cleared");
    }

    public void printCacheStats() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                System.out.println("✅ Cache: " + cacheName);
            }
        });
    }
}
