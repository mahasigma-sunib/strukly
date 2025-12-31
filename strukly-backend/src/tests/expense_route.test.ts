import request from "supertest";
import app from "../app";
import {
    createExpenseUseCase,
    getExpenseListUseCase,
    getWeeklyExpenseReportUseCase,
    getExpenseDetailUseCase,
    updateExpenseUseCase,
    deleteExpenseUseCase,
    tokenService,
} from "../composition_root";

// Mock the composition root
jest.mock("../composition_root", () => ({
    createExpenseUseCase: { execute: jest.fn() },
    getExpenseListUseCase: { execute: jest.fn() },
    getWeeklyExpenseReportUseCase: { execute: jest.fn() },
    getExpenseDetailUseCase: { execute: jest.fn() },
    updateExpenseUseCase: { execute: jest.fn() },
    deleteExpenseUseCase: { execute: jest.fn() },
    imageToExpenseUseCase: { execute: jest.fn() },
    tokenService: { verify: jest.fn() },
}));

describe("Expense Routes", () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    const validUUID = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID

    // Helper to create a Mock Expense Aggregate
    const createMockExpense = (overrides = {}) => ({
        header: {
            id: { value: validUUID },
            userID: { value: mockUser.id },
            vendorName: "Lunch",
            category: { value: "Food" },
            dateTime: new Date("2023-10-27T10:00:00.000Z"),
            subtotalAmount: { value: 100, currency: "IDR" },
            taxAmount: { value: 0, currency: "IDR" },
            discountAmount: { value: 0, currency: "IDR" },
            serviceAmount: { value: 0, currency: "IDR" },
            totalAmount: { value: 100, currency: "IDR" },
        },
        items: [
            {
                id: { value: "item-1" },
                name: "Nasi Goreng",
                quantity: 1,
                singlePrice: { value: 100, currency: "IDR" },
                totalPrice: { value: 100, currency: "IDR" },
                expenseID: { value: validUUID },
            },
        ],
        getExpenseID: () => ({ value: validUUID }),
        ...overrides,
    });

    // Valid Request Body
    const validRequestBody = {
        vendorName: "Lunch",
        category: "Food",
        dateTime: "2023-10-27T10:00:00.000Z",
        subtotalAmount: { amount: 100, currency: "IDR" },
        taxAmount: { amount: 0, currency: "IDR" },
        discountAmount: { amount: 0, currency: "IDR" },
        serviceAmount: { amount: 0, currency: "IDR" },
        items: [
            {
                name: "Nasi Goreng",
                quantity: 1,
                singlePrice: { amount: 100, currency: "IDR" },
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Authentication", () => {
        it("should return 401 if no token is provided", async () => {
            const response = await request(app).get("/api/expenses");
            expect(response.status).toBe(401);
        });

        it("should return 401 if token is invalid", async () => {
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
            (tokenService.verify as jest.Mock).mockRejectedValue(new Error("Invalid token"));
            const response = await request(app)
                .get("/api/expenses")
                .set("Cookie", ["access_token=invalid"]);
            expect(response.status).toBe(401);
            consoleSpy.mockRestore();
        });
    });

    describe("POST /api/expenses", () => {
        it("should create expense successfully", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);
            (createExpenseUseCase.execute as jest.Mock).mockResolvedValue(createMockExpense());

            const response = await request(app)
                .post("/api/expenses")
                .set("Cookie", ["access_token=valid"])
                .send(validRequestBody);

            expect(response.status).toBe(201);
            expect(createExpenseUseCase.execute).toHaveBeenCalled();
        });

        it("should return 400 for invalid body", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post("/api/expenses")
                .set("Cookie", ["access_token=valid"])
                .send({}); // Empty body

            expect(response.status).toBe(400);
            expect(createExpenseUseCase.execute).not.toHaveBeenCalled();
        });
    });

    describe("GET /api/expenses", () => {
        it("should get expense list", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);
            (getExpenseListUseCase.execute as jest.Mock).mockResolvedValue({
                total: 100,
                weekly: [],
                history: [],
            });

            const response = await request(app)
                .get("/api/expenses")
                .query({ month: 10, year: 2023 })
                .set("Cookie", ["access_token=valid"]);

            expect(response.status).toBe(200);
            expect(getExpenseListUseCase.execute).toHaveBeenCalled();
        });

        it("should return 400 for missing query params", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .get("/api/expenses")
                .set("Cookie", ["access_token=valid"]);

            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/expenses/weekly", () => {
        it("should get weekly report", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);
            (getWeeklyExpenseReportUseCase.execute as jest.Mock).mockResolvedValue({
                startDate: new Date(),
                endDate: new Date(),
                totalSpent: 0,
                daily: [],
                history: [],
            });

            const response = await request(app)
                .get("/api/expenses/weekly")
                .set("Cookie", ["access_token=valid"]);

            expect(response.status).toBe(200);
            expect(getWeeklyExpenseReportUseCase.execute).toHaveBeenCalled();
        });
    });

    describe("GET /api/expenses/:expenseID", () => {
        it("should get expense detail", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);
            (getExpenseDetailUseCase.execute as jest.Mock).mockResolvedValue(createMockExpense());

            const response = await request(app)
                .get(`/api/expenses/${validUUID}`)
                .set("Cookie", ["access_token=valid"]);

            expect(response.status).toBe(200);
            expect(getExpenseDetailUseCase.execute).toHaveBeenCalled();
        });

        it("should return 400 for invalid UUID", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .get("/api/expenses/invalid-uuid")
                .set("Cookie", ["access_token=valid"]);

            expect(response.status).toBe(400);
        });
    });

    describe("PUT /api/expenses/:expenseID", () => {
        it("should update expense", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);
            (updateExpenseUseCase.execute as jest.Mock).mockResolvedValue(createMockExpense());

            const response = await request(app)
                .put(`/api/expenses/${validUUID}`)
                .set("Cookie", ["access_token=valid"])
                .send(validRequestBody);

            expect(response.status).toBe(200);
            expect(updateExpenseUseCase.execute).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/expenses/:expenseID", () => {
        it("should delete expense", async () => {
            (tokenService.verify as jest.Mock).mockResolvedValue(mockUser);
            (deleteExpenseUseCase.execute as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete(`/api/expenses/${validUUID}`)
                .set("Cookie", ["access_token=valid"]);

            expect(response.status).toBe(200);
            expect(deleteExpenseUseCase.execute).toHaveBeenCalled();
        });
    });
});
