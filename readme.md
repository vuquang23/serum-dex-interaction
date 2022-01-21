## **Test tương tác với Serum-dex**
<br>

- branch **already-init**: đã tạo sẵn market, marketmaker, chạy script để tạo asks và bids.<br>
- branch **not-yet-init**: chạy script tạo lại mọi thứ từ đầu cho đến đặt asks và bids.
- DEX ProgramID (DEVNET):
**DSgEyE3kT8yK4Je9RSyQcPZrn6bao8nd7cq8KBtgyiz6**
- Proxy ProgramID (DEVNET):  **EUdtZVeXMQoqZwyK8fFRoTMDbs9WwW1VAvkMDrdDhbnu**.<br>
Do không dùng DEX default trên DEVNET của Serum nên cần sửa thư viện anchor-spl (địa chỉ devnet) và đổi **feature** thành **devnet** trong **permissioned** trong **SERUM-DEX** để build Proxy trỏ vào **new DEX ProgramID**.