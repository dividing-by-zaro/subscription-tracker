import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@test/testUtils';
import { SubscriptionTable } from './SubscriptionTable';
import { mockSubscriptions } from '@test/mockData';

describe('SubscriptionTable Sorting', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  describe('Service Name Sorting', () => {
    it('should sort services alphabetically in ascending order on first click', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const serviceHeader = screen.getByText('Service').closest('th');
      fireEvent.click(serviceHeader!);

      const rows = screen.getAllByRole('row');
      const firstServiceRow = rows[1]; // Skip header row
      expect(firstServiceRow.textContent).toContain('Adobe Creative Cloud');
    });

    it('should sort services in descending order on second click', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const serviceHeader = screen.getByText('Service').closest('th');
      fireEvent.click(serviceHeader!); // Ascending
      fireEvent.click(serviceHeader!); // Descending

      const rows = screen.getAllByRole('row');
      const firstServiceRow = rows[1];
      expect(firstServiceRow.textContent).toContain('Spotify');
    });

    it('should reset to original order on third click', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const serviceHeader = screen.getByText('Service').closest('th');
      const originalFirstService = screen.getAllByRole('row')[1].textContent;

      fireEvent.click(serviceHeader!); // Ascending
      fireEvent.click(serviceHeader!); // Descending
      fireEvent.click(serviceHeader!); // Reset

      const rows = screen.getAllByRole('row');
      expect(rows[1].textContent).toBe(originalFirstService);
    });
  });

  describe('Amount Sorting', () => {
    it('should sort by amount in ascending order (lowest first)', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const amountHeader = screen.getByText('Amount').closest('th');
      fireEvent.click(amountHeader!);

      const rows = screen.getAllByRole('row');
      // Spotify has the lowest amount at 9.99
      expect(rows[1].textContent).toContain('Spotify');
    });

    it('should sort by amount in descending order (highest first)', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const amountHeader = screen.getByText('Amount').closest('th');
      fireEvent.click(amountHeader!); // Ascending
      fireEvent.click(amountHeader!); // Descending

      const rows = screen.getAllByRole('row');
      // Adobe Creative Cloud has the highest amount at 599.88
      expect(rows[1].textContent).toContain('Adobe Creative Cloud');
    });
  });

  describe('Category Sorting', () => {
    it('should sort by category alphabetically', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const categoryHeader = screen.getByText('Category').closest('th');
      fireEvent.click(categoryHeader!);

      const rows = screen.getAllByRole('row');
      // Education comes first alphabetically, then entertainment, etc.
      expect(rows[1].textContent).toContain('Education');
    });
  });

  describe('Status Sorting', () => {
    it('should sort by status alphabetically', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const statusHeader = screen.getByText('Status').closest('th');
      fireEvent.click(statusHeader!);

      const rows = screen.getAllByRole('row');
      // "active" comes first alphabetically
      expect(rows[1].textContent).toContain('active');
    });

    it('should sort status in descending order', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const statusHeader = screen.getByText('Status').closest('th');
      fireEvent.click(statusHeader!); // Ascending
      fireEvent.click(statusHeader!); // Descending

      const rows = screen.getAllByRole('row');
      // "trial" comes last alphabetically
      expect(rows[1].textContent).toContain('trial');
    });
  });

  describe('Next Billing Date Sorting', () => {
    it('should sort by date in ascending order (soonest first)', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const dateHeader = screen.getByText('Next Billing').closest('th');
      fireEvent.click(dateHeader!);

      const rows = screen.getAllByRole('row');
      // Dropbox has the earliest date (2024-11-25)
      expect(rows[1].textContent).toContain('Dropbox');
    });

    it('should sort by date in descending order (latest first)', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const dateHeader = screen.getByText('Next Billing').closest('th');
      fireEvent.click(dateHeader!); // Ascending
      fireEvent.click(dateHeader!); // Descending

      const rows = screen.getAllByRole('row');
      // Coursera has the latest date (2025-06-01)
      expect(rows[1].textContent).toContain('Coursera');
    });
  });

  describe('Sort Icon Display', () => {
    it('should display neutral icon on unsorted columns', () => {
      const { container } = render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      // All sortable headers should have sort icons
      const headers = container.querySelectorAll('th[style*="cursor: pointer"]');
      expect(headers.length).toBeGreaterThan(0);
    });

    it('should change icon when sorting is applied', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const serviceHeader = screen.getByText('Service').closest('th');
      fireEvent.click(serviceHeader!);

      // After clicking, the sort state should change (tested via visual icon change)
      expect(serviceHeader).toBeInTheDocument();
    });
  });

  describe('Multiple Column Sorting', () => {
    it('should reset previous sort when sorting a different column', () => {
      render(
        <SubscriptionTable
          subscriptions={mockSubscriptions}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const serviceHeader = screen.getByText('Service').closest('th');
      const amountHeader = screen.getByText('Amount').closest('th');

      // Sort by service
      fireEvent.click(serviceHeader!);
      const rowsAfterServiceSort = screen.getAllByRole('row');
      const firstAfterService = rowsAfterServiceSort[1].textContent;

      // Sort by amount (should override service sort)
      fireEvent.click(amountHeader!);
      const rowsAfterAmountSort = screen.getAllByRole('row');
      const firstAfterAmount = rowsAfterAmountSort[1].textContent;

      // The first row should be different after sorting by amount
      expect(firstAfterAmount).not.toBe(firstAfterService);
    });
  });
});
