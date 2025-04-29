export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        await connectDB();
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        const { cartItems } = user;
        // Kiểm tra nếu cartItems rỗng hoặc undefined
        if (!cartItems || Object.keys(cartItems).length === 0) {
            return NextResponse.json({ success: true, cartItems: {} });
        }

        return NextResponse.json({ success: true, cartItems });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}