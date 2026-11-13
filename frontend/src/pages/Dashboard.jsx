
import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    <span className="dashboard-logo-icon">L</span>
                    LendTrack
                </div>

                <nav className="dashboard-nav">
                    <a className="active" href="/dashboard">Dashboard</a>
                    <a href="/customers">Customers</a>
                    <a href="/loans">Loans</a>
                    <a href="/repayments">Repayments</a>
                    <a href="/transactions">Transactions</a>
                    <a href="/reports">Reports</a>
                    <a href="/settings">Settings</a>
                </nav>

                <div className="sidebar-footer">
                    Personal Lending System
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back! Here's your lending overview.</p>
                    </div>

                    <div className="admin-profile">
                        <div className="admin-avatar">A</div>
                        <span>Administrator</span>
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="dashboard-stats">

                    <div className="stat-card">
                        <p>Total Customers</p>
                        <h2>0</h2>
                        <span>Registered customers</span>
                    </div>

                    <div className="stat-card">
                        <p>Active Loans</p>
                        <h2>0</h2>
                        <span>Currently running</span>
                    </div>

                    <div className="stat-card">
                        <p>Total Amount Lent</p>
                        <h2>₹0</h2>
                        <span>Across all loans</span>
                    </div>

                    <div className="stat-card">
                        <p>Pending Repayments</p>
                        <h2>₹0</h2>
                        <span>Awaiting collection</span>
                    </div>

                </section>

                {/* Recent Transactions */}
                <section className="dashboard-transactions">
                    <div className="section-heading">
                        <h2>Recent Transactions</h2>
                        <button type="button">View All</button>
                    </div>

                    <div className="empty-transactions">
                        <h3>No transactions yet</h3>
                        <p>Your recent loan and repayment activity will appear here.</p>
                    </div>
                </section>

            </main>
        </div>
    );
}

export default Dashboard;
