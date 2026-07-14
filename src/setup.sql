-- ============================================================
-- CSE 340 Service Network - Database Setup Script
-- Run this file to re-create the entire database from scratch.
-- (Render's free tier deletes databases after ~30 days.)
-- ============================================================

-- Drop in reverse dependency order so the script can be re-run safely
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Project Table
-- Every project is sponsored by exactly one organization.
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project_Category Junction Table
-- A project can belong to many categories, and a category can
-- contain many projects (many-to-many). The composite primary key
-- prevents the same pairing from being inserted twice.
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT pk_project_category PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)
        REFERENCES project (project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Insert sample data: Projects (5 per organization)
-- ========================================
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Community Center Renovation', 'Repair and repaint the neighborhood community center so it can reopen to the public.', 'Rexburg, ID', '2026-08-08'),
(1, 'Wheelchair Ramp Build', 'Construct accessible wheelchair ramps for homes of elderly residents.', 'Idaho Falls, ID', '2026-08-15'),
(1, 'Playground Restoration', 'Replace broken equipment and lay new safety surfacing at the city playground.', 'Rigby, ID', '2026-08-22'),
(1, 'Habitat Home Framing', 'Frame walls and install roofing for a family in need of affordable housing.', 'Blackfoot, ID', '2026-09-05'),
(1, 'Public Library Repairs', 'Fix shelving, lighting, and flooring at the local public library.', 'Rexburg, ID', '2026-09-19'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Community Garden Planting', 'Prepare beds and plant vegetables in the shared neighborhood garden.', 'Rexburg, ID', '2026-08-10'),
(2, 'River Cleanup Day', 'Remove trash and debris along the riverbank to protect local wildlife.', 'Idaho Falls, ID', '2026-08-17'),
(2, 'Tree Planting Initiative', 'Plant native trees to expand the urban canopy and improve air quality.', 'Ammon, ID', '2026-08-29'),
(2, 'Composting Workshop', 'Teach families how to compost food waste and reduce landfill contributions.', 'Rexburg, ID', '2026-09-12'),
(2, 'Farmers Market Food Drive', 'Collect fresh surplus produce and distribute it to local food banks.', 'Sugar City, ID', '2026-09-26'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'After-School Tutoring', 'Tutor elementary students in reading and mathematics after school hours.', 'Rexburg, ID', '2026-08-12'),
(3, 'Senior Center Visits', 'Spend time with residents at the senior center playing games and visiting.', 'Idaho Falls, ID', '2026-08-19'),
(3, 'Winter Coat Drive', 'Collect, sort, and distribute warm coats to families before winter.', 'Rigby, ID', '2026-09-08'),
(3, 'Community Health Fair', 'Support free health screenings and wellness education for the community.', 'Rexburg, ID', '2026-09-22'),
(3, 'Adult Literacy Program', 'Help adult learners build reading skills through one-on-one mentoring.', 'Blackfoot, ID', '2026-10-03');

-- ========================================
-- Associate each project with at least one category
-- (category_id: 1 = Environmental, 2 = Educational,
--               3 = Community Service, 4 = Health and Wellness)
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
(1, 3),           -- Community Center Renovation -> Community Service
(2, 3), (2, 4),   -- Wheelchair Ramp Build -> Community Service, Health and Wellness
(3, 3),           -- Playground Restoration -> Community Service
(4, 3),           -- Habitat Home Framing -> Community Service
(5, 2), (5, 3),   -- Public Library Repairs -> Educational, Community Service
(6, 1),           -- Community Garden Planting -> Environmental
(7, 1),           -- River Cleanup Day -> Environmental
(8, 1),           -- Tree Planting Initiative -> Environmental
(9, 1), (9, 2),   -- Composting Workshop -> Environmental, Educational
(10, 3), (10, 4), -- Farmers Market Food Drive -> Community Service, Health and Wellness
(11, 2),          -- After-School Tutoring -> Educational
(12, 3), (12, 4), -- Senior Center Visits -> Community Service, Health and Wellness
(13, 3),          -- Winter Coat Drive -> Community Service
(14, 4),          -- Community Health Fair -> Health and Wellness
(15, 2);          -- Adult Literacy Program -> Educational
