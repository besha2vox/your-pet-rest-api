const noticesFilter = async (req, res, next) => {
    const { gender, age } = req.query;
    const query = {};
    if (!gender && !age) {
        next();
        return;
    }

    if (gender) {
        query.sex = gender.toLowerCase();
    }

    if (age) {
        const today = new Date();
        switch (age) {
            case '3m-12m':
                query.birthday = {
                    $gte: new Date(
                        today.getFullYear() - 1,
                        today.getMonth(),
                        today.getDate()
                    ),
                    $lt: new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    ),
                };
                break;

            case '1y':
                query.birthday = {
                    $gte: new Date(
                        today.getFullYear() - 2,
                        today.getMonth(),
                        today.getDate()
                    ),
                    $lt: new Date(
                        today.getFullYear() - 1,
                        today.getMonth(),
                        today.getDate()
                    ),
                };
                break;

            case '2y':
                query.birthday = {
                    $lt: new Date(
                        today.getFullYear() - 2,
                        today.getMonth(),
                        today.getDate()
                    ),
                };
                break;

            default:
                break;
        }
    }
    req.searchQuery = query;
    next();
};

module.exports = noticesFilter;
