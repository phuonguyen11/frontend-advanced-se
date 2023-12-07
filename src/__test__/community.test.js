import React from 'react';
// import { render, screen } from '@testing-library/react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tables from '../pages/tables';
import * as api from '../api';

jest.mock('../api');

const MOCK_PROJECTS = [
    {
        "id": 6,
        "name": "Khám phá Thiên nhiên trong Mùa hè xanh",
        "description": "Chuyến thám hiểm thiên nhiên tại khu vực dã ngoại.",
        "location": "Khu rừng quốc gia ABC, Thành phố Y",
        "start_date": "2023-07-10T00:00:00.000Z",
        "end_date": "2023-07-15T00:00:00.000Z",
        "quantity": 150,
        "is_checked": null,
        "user_id": 456,
        "uni_id": 1
    },
]

describe('Community Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    // test('renders component correctly', () => {
    //     localStorage.setItem('role', '1');
    //     render(<Tables />);
    //     // expect(screen.getByText('Community')).toBeInTheDocument();
    //     expect(screen.getByText('Community board')).toBeInTheDocument();
    // });

    test('renders "You don\'t have permission" message when role is not 1', () => {
        localStorage.setItem('role', '2');
        render(<Tables />);
        expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
    });
    test('renders "You don\'t have permission" message when role is not 1', () => {
        localStorage.setItem('role', '0');
        render(<Tables />);
        expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
    });

    // test('fetches project data on mount', async () => {
    //     localStorage.setItem('role', '1');
    //     api.getProject.mockResolvedValueOnce([{ id: 1, name: 'Project 1' }]);
    //     render(<Tables />);
    //         expect(api.getProject).toHaveBeenCalledTimes(1);
    //     });
    // });

    // test('fetches uni data on mount', async () => {
    //     localStorage.setItem('role', '2');
    //     api.getUni.mockResolvedValueOnce([{ id: 1, name: 'University 1' }]);
    //     render(<UniversityAdministratorStaff />);
    //     await waitFor(() => {
    //         expect(api.getUni).toHaveBeenCalledTimes(1);
    //     });
    // });

    // test('handles project acceptance', async () => {
    //     localStorage.setItem('role', '2');
    //     localStorage.setItem('uni_id', '1')
    //     api.getAllProjectsOfAllUnis.mockResolvedValueOnce(MOCK_PROJECTS);
    //     api.getUni.mockResolvedValueOnce([{ id: 1, name: 'University 1' }]);
    //     render(<UniversityAdministratorStaff />);

    //     // Wait for the project data to be fetched
    //     await waitFor(() => {
    //         expect(api.getAllProjectsOfAllUnis).toHaveBeenCalledTimes(1);
    //     });

    //     fireEvent.click(screen.getByText('Accept'));



    //     await waitFor(() => {
    //         // Trigger the acceptance
    //         expect(api.updateProjectChecked).toHaveBeenCalledTimes(1);
    //     });
    // });

    // test('handles project rejection', async () => {
    //     localStorage.setItem('role', '2');
    //     localStorage.setItem('uni_id', '1')
    //     api.getAllProjectsOfAllUnis.mockResolvedValueOnce(MOCK_PROJECTS);
    //     api.getUni.mockResolvedValueOnce([{ id: 1, name: 'University 1' }]);
    //     render(<UniversityAdministratorStaff />);

    //     // Wait for the project data to be fetched
    //     await waitFor(() => {
    //         expect(api.getAllProjectsOfAllUnis).toHaveBeenCalledTimes(1);
    //     });

    //     // Trigger the rejection
    //     fireEvent.click(screen.getByText('Reject'));

    //     await waitFor(() => {
    //         expect(api.updateProjectChecked).toHaveBeenCalledTimes(1);
    //     });
    // });
});

