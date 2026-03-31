<?php
/**
 * PureBeauty Backend API
 * Handles saving orders mapping from JavaScript and fetching orders for the Admin Dashboard.
 * Requires PHP and MySQL.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database Configuration
$host = '127.0.0.1';
$db   = 'purebeauty';
$user = 'root'; // Change to your MySQL User
$pass = ''; // Change to your MySQL Password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database connection failed. Please ensure MySQL is running locally and credentials are correct.']);
    exit;
}

$action = $_GET['action'] ?? '';

// --- Save an Order ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create_order') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data || !isset($data['cart']) || !isset($data['customer'])) {
        echo json_encode(['success' => false, 'error' => 'Invalid data provided']);
        exit;
    }

    $customer = $data['customer'];
    $cart = $data['cart'];
    $subtotal = $data['subtotal'];
    $shipping = $data['shipping'];
    $total = $data['total'];

    try {
        $pdo->beginTransaction();

        // Insert into orders table
        $stmt = $pdo->prepare('INSERT INTO orders (full_name, address, phone, payment_method, subtotal, shipping_fee, total) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $customer['fullName'],
            $customer['address'],
            $customer['phone'],
            $customer['paymentMethod'],
            $subtotal,
            $shipping,
            $total
        ]);

        $orderId = $pdo->lastInsertId();

        // Insert order items
        $stmtItem = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)');
        foreach ($cart as $item) {
            $stmtItem->execute([
                $orderId,
                $item['id'],
                $item['name'],
                $item['price'],
                $item['quantity']
            ]);
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'order_id' => $orderId, 'message' => 'Order placed successfully']);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Failed to save order: ' . $e->getMessage()]);
    }
    exit;
}

// --- Fetch Orders for Admin ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get_orders') {
    try {
        $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            // Fetch items for each order
            $stmtItem = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
            $stmtItem->execute([$order['id']]);
            $order['items'] = $stmtItem->fetchAll();
        }

        echo json_encode(['success' => true, 'orders' => $orders]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
    exit;
}

// --- Update Order Status ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_status') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (isset($data['order_id']) && isset($data['status'])) {
        try {
            $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
            $stmt->execute([$data['status'], $data['order_id']]);
            echo json_encode(['success' => true, 'message' => 'Status updated']);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => 'Failed to update status']);
        }
    }
    exit;
}

echo json_encode(['error' => 'Invalid Request']);
