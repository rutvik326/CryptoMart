package com.rutvik.Service;

import com.rutvik.model.Asset;
import com.rutvik.model.Coin;
import com.rutvik.model.User;
import com.rutvik.Repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetServiceImpl implements AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Override
    public Asset createAsset(User user, Coin coin, double quantity) {
        Asset asset = new Asset();
        asset.setUser(user);
        asset.setCoin(coin);
        asset.setQuantity(quantity);
        // Save the initial Buy Price
        asset.setBuyPrice(coin.getCurrentPrice());

        return assetRepository.save(asset);
    }

    @Override
    public Asset getAssetById(Long assetId) throws Exception {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new Exception("Asset not found"));
    }

    @Override
    public Asset getAssetByUserIdAndCoinId(Long userId, String coinId) {
        return assetRepository.findByUserIdAndCoinId(userId, coinId);
    }

    @Override
    public List<Asset> getUsersAssets(Long userId) {
        return assetRepository.findByUserId(userId);
    }

    @Override
    public Asset updateAsset(Long assetId, double quantity) throws Exception {
        Asset oldAsset = getAssetById(assetId);

        // CASE 1: SELLING (Quantity is negative)
        // If selling, we only update quantity. The Buy Price stays the same.
        if (quantity < 0) {
            oldAsset.setQuantity(oldAsset.getQuantity() + quantity);
            return assetRepository.save(oldAsset);
        }

        // CASE 2: BUYING MORE (Quantity is positive)
        // We must calculate the new Average Buy Price

        // A. Value of existing holdings (Old Qty * Old Avg Price)
        double oldTotalValue = oldAsset.getQuantity() * oldAsset.getBuyPrice();

        // B. Value of new coins (New Qty * Current Market Price)
        // NOTE: We assume coin.getCurrentPrice() is up-to-date.
        double currentMarketPrice = oldAsset.getCoin().getCurrentPrice();
        double newTotalValue = quantity * currentMarketPrice;

        // C. New Total Quantity
        double totalQuantity = oldAsset.getQuantity() + quantity;

        // D. Calculate Weighted Average Price: (Old Value + New Value) / Total Qty
        double weightedAvgPrice = (oldTotalValue + newTotalValue) / totalQuantity;

        // E. Update Asset
        oldAsset.setQuantity(totalQuantity);
        oldAsset.setBuyPrice(weightedAvgPrice);

        return assetRepository.save(oldAsset);
    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) {
        return assetRepository.findByUserIdAndCoinId(userId, coinId);
    }

    @Override
    public void deleteAsset(Long assetId) {
        assetRepository.deleteById(assetId);
    }
}