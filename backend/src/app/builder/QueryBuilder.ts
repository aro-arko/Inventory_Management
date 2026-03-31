import mongoose, { Query, Types } from 'mongoose';

type QueryParams = {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: string;
    page?: string;
    fields?: string;
    subjects?: string;
    rating?: string;
    maxRate?: string;
    availability?: string;
};

class QueryBuilder<T> {
    private modelQuery: Query<T[], T>;
    private query: QueryParams;
    private filters: Record<string, any> = {};

    constructor(modelQuery: Query<T[], T>, query: QueryParams) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: (keyof T)[]) {
        const searchTerm = this.query.search?.trim();
        if (searchTerm) {
            this.filters = {
                ...this.filters,
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            };
        }
        return this;
    }

    filter() {
        const filters: any = { ...this.filters };

        if (this.query.subjects) {
            const ids = this.query.subjects.split(',').filter(id => Types.ObjectId.isValid(id.trim()));
            if (ids.length) filters['subject'] = { $in: ids };
        }

        if (this.query.rating) filters['rating'] = { $gte: Number(this.query.rating) };
        if (this.query.maxRate) filters['hourlyRate'] = { $lte: Number(this.query.maxRate) };
        if (this.query.availability) filters['availability.day'] = this.query.availability;

        this.filters = filters;
        return this;
    }

    sort() {
        const sort = `${this.query.sortOrder === 'asc' ? '' : '-'}${this.query.sortBy || 'rating'}`;
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    paginate() {
        const limit = Math.max(Number(this.query.limit) || 9, 1);
        const skip = (Math.max(Number(this.query.page) || 1, 1) - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    fields() {
        if (this.query.fields) {
            this.modelQuery = this.modelQuery.select(this.query.fields.split(',').join(' '));
        }
        return this;
    }

    build() {
        this.modelQuery = this.modelQuery.find(this.filters);
        return this.modelQuery;
    }
}

export default QueryBuilder;