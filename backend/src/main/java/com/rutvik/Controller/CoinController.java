package com.rutvik.Controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rutvik.Service.CoinService;
import com.rutvik.model.Coin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coins")
public class CoinController {

    @Autowired
    private CoinService coinService;

    @Autowired
    private ObjectMapper objectMapper;

    // Cache per page
    @Cacheable(value = "coinList", key = "#page")
    @GetMapping
    public ResponseEntity<List<Coin>> getCoinList(
            @RequestParam(name = "page", defaultValue = "1") int page) throws Exception {

        List<Coin> coins = coinService.getCoinList(page);
        return new ResponseEntity<>(coins, HttpStatus.OK);
    }

    // Cache chart by coinId + days
    @Cacheable(value = "marketChart", key = "#coinId + '_' + #days")
    @GetMapping("/{coinId}/chart")
    public ResponseEntity<JsonNode> getMarketChart(@PathVariable String coinId,
                                                   @RequestParam("days") int days) throws Exception {

        String marketChart = coinService.getMarketChart(coinId, days);
        JsonNode jsonNode = objectMapper.readTree(marketChart);
        return new ResponseEntity<>(jsonNode, HttpStatus.OK);
    }

    // Cache search results by keyword
    @Cacheable(value = "searchResults", key = "#keyword")
    @GetMapping("/search")
    public ResponseEntity<JsonNode> searchCoin(@RequestParam("q") String keyword) throws Exception {

        String coin = coinService.searchCoin(keyword);
        JsonNode jsonNode = objectMapper.readTree(coin);
        return new ResponseEntity<>(jsonNode, HttpStatus.ACCEPTED);
    }

    // Cache top 50 list
    @Cacheable(value = "top50Coins")
    @GetMapping("/top50")
    public ResponseEntity<JsonNode> getTop50Coin() throws Exception {

        String coins = coinService.getTop50CoinsByMarketCapRank();
        JsonNode jsonNode = objectMapper.readTree(coins);
        return new ResponseEntity<>(jsonNode, HttpStatus.OK);
    }

    // Cache trending list
    @Cacheable(value = "trendingCoins")
    @GetMapping("/trending")
    public ResponseEntity<JsonNode> getTrendingCoin() throws Exception {

        String coins = coinService.getTrendingCoins();
        JsonNode jsonNode = objectMapper.readTree(coins);
        return new ResponseEntity<>(jsonNode, HttpStatus.OK);
    }

    // Cache coin details by id
    @Cacheable(value = "coinDetails", key = "#coinId")
    @GetMapping("/details/{coinId}")
    public ResponseEntity<JsonNode> getCoinDetails(@PathVariable String coinId) throws Exception {

        String coin = coinService.getCoinDetails(coinId);
        JsonNode jsonNode = objectMapper.readTree(coin);
        return new ResponseEntity<>(jsonNode, HttpStatus.OK);
    }
}
