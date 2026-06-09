package com.rutvik.Service;

import com.rutvik.domain.WalletTransactionType;
import com.rutvik.model.User;
import com.rutvik.model.Wallet;
import com.rutvik.model.WalletTransaction;
import com.rutvik.Repository.WalletRepository;
import com.rutvik.Repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Override
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO);
            return walletRepository.save(wallet);
        }
        if (wallet.getBalance() == null) {
            wallet.setBalance(BigDecimal.ZERO);
        }
        return wallet;
    }

    @Override
    @Transactional
    public Wallet addBalance(Wallet wallet, Long money) {
        BigDecimal amountToAdd = BigDecimal.valueOf(money);
        BigDecimal currentBalance = (wallet.getBalance() == null) ? BigDecimal.ZERO : wallet.getBalance();

        wallet.setBalance(currentBalance.add(amountToAdd));

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(money);
        transaction.setType(WalletTransactionType.ADD_MONEY);
        transaction.setPurpose("Wallet Topup");
        transaction.setDate(LocalDate.now());

        walletTransactionRepository.save(transaction);
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        return walletRepository.findById(id)
                .orElseThrow(() -> new Exception("Wallet not found with ID: " + id));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        Wallet senderWallet = getUserWallet(sender);
        BigDecimal transferAmount = BigDecimal.valueOf(amount);

        if (senderWallet.getBalance().compareTo(transferAmount) < 0) {
            throw new Exception("Insufficient balance for transfer");
        }

        // 1. Update Sender Balance
        senderWallet.setBalance(senderWallet.getBalance().subtract(transferAmount));
        walletRepository.save(senderWallet);

        // 2. Update Receiver Balance
        BigDecimal receiverBalance = (receiverWallet.getBalance() == null) ? BigDecimal.ZERO : receiverWallet.getBalance();
        receiverWallet.setBalance(receiverBalance.add(transferAmount));
        walletRepository.save(receiverWallet);

        // 3. Create History for Sender (DEBIT)
        WalletTransaction senderTx = new WalletTransaction();
        senderTx.setWallet(senderWallet);
        senderTx.setAmount(-amount); // Negative for sender
        senderTx.setType(WalletTransactionType.WALLET_TRANSFER);
        senderTx.setPurpose("Transfer to " + receiverWallet.getUser().getFullName());
        senderTx.setDate(LocalDate.now());
        senderTx.setTransferId(receiverWallet.getId().toString());
        walletTransactionRepository.save(senderTx);

        // 4. Create History for Receiver (CREDIT) - FIXED: Now shows for receiver
        WalletTransaction receiverTx = new WalletTransaction();
        receiverTx.setWallet(receiverWallet);
        receiverTx.setAmount(amount); // Positive for receiver
        receiverTx.setType(WalletTransactionType.WALLET_TRANSFER);
        receiverTx.setPurpose("Received from " + sender.getFullName());
        receiverTx.setDate(LocalDate.now());
        receiverTx.setTransferId(senderWallet.getId().toString());
        walletTransactionRepository.save(receiverTx);

        return senderWallet;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Wallet payOrderPayment(Wallet wallet, Long amount) throws Exception {
        BigDecimal deductionAmount = BigDecimal.valueOf(amount);
        if (wallet.getBalance().compareTo(deductionAmount) < 0) {
            throw new Exception("Insufficient funds");
        }

        wallet.setBalance(wallet.getBalance().subtract(deductionAmount));

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(-amount);
        transaction.setType(WalletTransactionType.WITHDRAWAL);
        transaction.setPurpose("Order Payment / Withdrawal");
        transaction.setDate(LocalDate.now());

        walletTransactionRepository.save(transaction);
        return walletRepository.save(wallet);
    }
}